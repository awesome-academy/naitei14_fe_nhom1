"use client";
import "@/src/i18n/i18n";
import Image from "next/image";
import Loading from "@/src/components/loading/Loading";
import OrderTable from "@/src/components/ordertable/OrderTable";
import SelectField from "@/src/components/selectfield/SelectField";
import titleleftdark from "@/public/Image_Rudu/titleleft-dark.png";
import BreadcrumbComponent from "@/src/components/breadcrumb/BreadcrumbComponent";
import { paymentOptions, shippingOptions } from "@/src/constants/shipping";
import { useTranslation } from "react-i18next";
import {
  OrderCreate,
  OrderStatus,
  OrderStore,
  OrderDetailCreate,
} from "@/src/types/order.types";
import { createOrder, createOrderDetails } from "@/src/utils/api/order.api";
import { useState, useMemo, useEffect } from "react";
import { formatCurrency } from "@/src/utils/format.currency";
import { clearCart } from "@/src/utils/api/cart.api";
import { fetchVoucher } from "@/src/utils/api/voucher.api";
import { addNotification } from "@/src/utils/api/notification.api";
import { ProductItem } from "@/src/components/ordertable/OrderTable";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import { useAddress } from "@/src/hooks/useAddressByUser";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { toast } from "sonner";
import { X } from "lucide-react";
import { useUserStore } from "@/src/stores/user.store";
import { Address } from "@/src/types/user.types";
import { Dialog, DialogTrigger } from "@/src/components/ui/dialog";
import ModalAddress from "@/src/components/address/ModalAddress";
import { useCartStore } from "@/src/stores/cart.store";

const CheckoutPage = () => {
  const { t } = useTranslation();
  const { user: currentUser } = useUserStore();
  const userId = currentUser?.id;
  const router = useRouter();
  const ready = useRequireAuth();

  const [paymentMethod, setPaymentMethod] = useState(
    "Thanh toán khi nhận hàng"
  );
  const [shippingMethod, setShippingMethod] = useState("J&T Express");
  const [shippingFee, setShippingFee] = useState(15000);
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [voucherError, setVoucherError] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { addresses } = useAddress(userId!);

  //const { cart, setCart, setIsChange } = useCartContext();
  const { cart, setCart, setIsChange } = useCartStore();

  // Translate options - keep original values for API compatibility
  const translatedPaymentOptions = useMemo(
    () =>
      paymentOptions.map((opt) => ({
        ...opt,
        label: t("shipping.payment.cashOnDelivery"),
      })),
    [t]
  );

  const translatedShippingOptions = useMemo(
    () =>
      shippingOptions.map((opt) => ({
        ...opt,
        label:
          opt.value === "J&T Express"
            ? t("shipping.carrier.jnt")
            : t("shipping.carrier.fast"),
      })),
    [t]
  );
  const cartItems: ProductItem[] = useMemo(() => {
    return (
      cart?.items.map((item) => ({
        id: item.productId,
        product: item.product,
        quantity: item.quantity,
        totalPrice: item.quantity * (item.product?.price ?? 0),
      })) ?? []
    );
  }, [cart]);
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      setSelectedAddress(
        addresses.find((addr) => addr.isDefault) || addresses[0]
      );
    }
  }, [addresses]);

  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.totalPrice, 0),
    [cartItems]
  );

  const rawDiscount = useMemo(() => {
    return discount <= 100 ? (subtotal * discount) / 100 : discount;
  }, [subtotal, discount]);

  const totalPrice = useMemo(
    () => subtotal - rawDiscount + shippingFee,
    [subtotal, rawDiscount, shippingFee]
  );

  const totalItems = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const userInfo = useMemo(
    () => [
      {
        label: t("checkout.customer.name"),
        value: `${currentUser?.firstName} ${currentUser?.lastName}`,
      },
      {
        label: t("checkout.customer.phone"),
        value: selectedAddress?.phone || t("checkout.customer.notUpdated"),
      },
      { label: t("checkout.customer.email"), value: currentUser?.email },
      {
        label: t("checkout.customer.address"),
        value: `${selectedAddress?.address}, ${selectedAddress?.city}, ${selectedAddress?.country}`,
      },
    ],
    [currentUser, selectedAddress, t]
  );
  const orderInfo = useMemo(
    () => [
      { label: t("checkout.order.shipping"), value: shippingMethod },
      {
        label: t("checkout.order.shippingFee"),
        value: formatCurrency(shippingFee),
      },
      { label: t("checkout.order.payment"), value: paymentMethod },
    ],
    [shippingMethod, shippingFee, paymentMethod, t]
  );
  const orderFinish = useMemo(
    () => [
      {
        label: t("checkout.summary.subtotal"),
        value: formatCurrency(subtotal),
        class: "text-base",
      },
      ...(discount > 0
        ? [
            {
              label: t("checkout.summary.discount"),
              value: `-${formatCurrency(rawDiscount)}`,
              class: "text-green-600",
            },
          ]
        : []),
      {
        label: t("checkout.summary.shippingFee"),
        value: formatCurrency(shippingFee),
        class: "text-base",
      },
    ],
    [subtotal, rawDiscount, shippingFee, t]
  );
  const handleApplyVoucher = async () => {
    if (!voucherCode) return;
    try {
      const voucher = await fetchVoucher(voucherCode);
      if (voucher?.discountType === "freeship") {
        setShippingFee(0);
        setVoucherError("");
      } else if (voucher?.discountType === "percentage") {
        setDiscount(voucher.discountValue);
        setVoucherError("");
      } else {
        setVoucherError(t("checkout.voucher.invalid"));
        setDiscount(0);
      }
    } catch (error) {
      console.error(error);
      setVoucherError(t("checkout.voucher.error"));
    }
  };

  const handleOrder = async () => {
    if (!cart || cart.items.length === 0) {
      toast.error(t("checkout.toast.emptyCart"));
      router.push("/");
      return;
    }
    if (!selectedAddress?.id) {
      toast.error(t("checkout.toast.noAddress"));
      router.push("/account/addresses");
      return;
    }

    const orderData: OrderCreate = {
      userId: userId!,
      addressId: selectedAddress?.id || "",
      status: OrderStatus.PENDING,
      store: OrderStore.HADONG,
      totalPrice: totalPrice,
      subtotal: subtotal,
      totalItem: totalItems,
      shippingFee: shippingFee,
      discount: discount,
      paymentMethod: paymentMethod,
      orderDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLoading(true);
    try {
      const res = await createOrder(orderData);
      const orderId = res.id.toString();

      router.prefetch(`/account/orders/${orderId}`);

      const orderDetails: OrderDetailCreate[] = cart.items.map((item) => ({
        orderId: orderId,
        productId: item.productId,
        product: item.product!,
        quantity: item.quantity,
        price: item.product?.price || 0,
        totalPrice: item.quantity * (item.product?.price || 0),
      }));

      await Promise.all([createOrderDetails(orderDetails), clearCart(cart)]);
      await addNotification(
        userId!,
        t("checkout.notification.title"),
        t("checkout.notification.message", { orderId }),
        `/account/orders/${orderId}`
      );
      setCart({ ...cart, items: [], totalPrice: 0 });
      setIsChange(false);

      toast.success(t("checkout.toast.success"));
      router.push(`/account/orders/${orderId}`);
    } catch (error) {
      console.error(error);
      toast.error(t("checkout.toast.error"));
    } finally {
      setLoading(false);
    }
  };
  if (!ready) return null;
  if (!cart || cart.items.length === 0) return <Loading />;
  return (
    <div className="py-6">
      <BreadcrumbComponent
        items={[
          { label: t("breadcrumb.home"), href: "/" },
          { label: t("cart.breadcrumb.title"), href: "/cart" },
          { label: t("breadcrumb.checkout") },
        ]}
      />
      <div className="my-6">
        <h1 className="text-2xl font-semibold mb-2">{t("checkout.title")}</h1>
        <Image src={titleleftdark} alt="Underline" width={70} height={20} />
      </div>

      <OrderTable data={cartItems} />

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="border rounded-xl p-4 space-y-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">{t("checkout.shipping.title")}</h2>
          <SelectField
            label={t("checkout.payment.label")}
            placeholder={t("checkout.payment.placeholder")}
            value={paymentMethod}
            onChange={setPaymentMethod}
            options={translatedPaymentOptions}
          />

          <SelectField
            label={t("checkout.shipping.label")}
            placeholder={t("checkout.shipping.placeholder")}
            value={shippingMethod}
            onChange={(value) => {
              setShippingMethod(value);
              const selectedOption = translatedShippingOptions.find(
                (option) => option.value === value
              );
              setShippingFee(selectedOption?.fee ?? 0);
            }}
            options={translatedShippingOptions}
          />
        </div>
        <div className="border rounded-xl p-4 space-y-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">{t("checkout.order.title")}</h2>
          {orderInfo.map((item) => (
            <p key={item.label} className="flex justify-between">
              <span>{item.label}</span>
              <span className="font-medium">{item.value}</span>
            </p>
          ))}
          <div className="space-y-2">
            <label htmlFor="voucher" className="block font-medium">
              {t("checkout.voucher.label")}
            </label>
            <div className="flex items-center gap-2">
              <Input
                id="voucher"
                type="text"
                value={voucherCode}
                onChange={(e) => {
                  setVoucherCode(e.target.value);
                  setVoucherError("");
                }}
                placeholder={t("checkout.voucher.placeholder")}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <Button variant="outline" onClick={handleApplyVoucher}>
                {t("checkout.voucher.apply")}
              </Button>
            </div>
            <div className="flex flex-row items-center gap-2">
              {voucherError && (
                <p className="text-red-500 text-sm">{voucherError}</p>
              )}
              {discount > 0 && (
                <Button variant="outline" onClick={() => setDiscount(0)}>
                  {t("checkout.voucher.discount")}: {discount}% <X className="ml-2" />
                </Button>
              )}
              {shippingFee === 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    const originalFee =
                      shippingOptions.find(
                        (opt) => opt.value === shippingMethod
                      )?.fee || 15000;
                    setShippingFee(originalFee);
                  }}
                >
                  {t("checkout.voucher.freeship")} <X className="ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="border rounded-xl p-4 space-y-2 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">{t("checkout.customer.title")}</h2>
          {userInfo.map((item) => (
            <p key={item.label}>
              <span className="font-medium">{item.label}:</span> {item.value}
            </p>
          ))}
          <Dialog open={openAddressModal} onOpenChange={setOpenAddressModal}>
            <DialogTrigger asChild>
              <span className="text-black underline hover:text-[var(--chart-1)] cursor-pointer ">
                {t("checkout.customer.changeAddress")}
              </span>
            </DialogTrigger>
            <ModalAddress
              addresses={addresses}
              selectedAddress={selectedAddress}
              onClose={() => setOpenAddressModal(false)}
              onSelect={(addr) => setSelectedAddress(addr)}
            />
          </Dialog>
        </div>
        <div className="border rounded-xl p-4 shadow-sm space-y-2">
          <h2 className="text-lg font-semibold mb-2">{t("checkout.summary.title")}</h2>
          {orderFinish.map((item, index) => (
            <p className={`flex justify-between ${item.class}`} key={index}>
              <span>{item.label}</span>
              <span className="font-medium">{item.value}</span>
            </p>
          ))}
          <hr />
          <p className="flex justify-between text-lg font-bold">
            <span>{t("checkout.summary.total")}</span>
            <span>{formatCurrency(totalPrice)}</span>
          </p>
          <Button
            className="w-full mt-2 bg-black text-white hover:bg-gray-800"
            onClick={handleOrder}
          >
            {t("checkout.summary.button")}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default CheckoutPage;
