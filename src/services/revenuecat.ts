import Purchases from "react-native-purchases";
import { Platform } from "react-native";

export const configureRevenueCat = () => {
  const apiKey =
    Platform.OS === "ios"
      ? process.env.EXPO_PUBLIC_REVENUECAT_PUBLIC_KEY_IOS
      : process.env.EXPO_PUBLIC_REVENUECAT_PUBLIC_KEY_ANDROID;
  if (!apiKey) throw new Error("Missing RevenueCat public key");
  Purchases.configure({ apiKey });
  Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG); // for dev
};

export const getEntitlements = async () => {
  try {
    const purchaserInfo = await Purchases.getCustomerInfo();
    return purchaserInfo.entitlements.active;
  } catch (e) {
    console.error("Error fetching entitlements:", e);
    return {};
  }
};

export const purchasePlus = async () => {
  const offerings = await Purchases.getOfferings();
  const packageToPurchase = offerings.current?.availablePackages.find((p) =>
    p.identifier.includes("plus"),
  );
  if (!packageToPurchase) throw new Error("No Plus package found");
  return Purchases.purchasePackage(packageToPurchase);
};
