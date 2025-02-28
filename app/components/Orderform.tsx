"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { OrderData } from "../../lib/types/order";
import { calculateOrderPrice } from "../../lib/utils/priceCalculator";
import Step1 from "./OrderSteps/Step1";
import Step2 from "./OrderSteps/Step2";
// import Step3A from "./OrderSteps/Step3A";
import Step3B from "./OrderSteps/Step3B";
// import Step3C from "./OrderSteps/Step3C";
import Step4 from "./OrderSteps/Step4";
import OrderSummary from "./OrderSteps/OrderSummary";

const OrderForm = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [hasUsedDiscount, setHasUsedDiscount] = useState(false);
  const [orderData, setOrderData] = useState<OrderData>({
    projectType: "",
    projectName: "",
    platform: "",
    applicationType: "",
    customerName: user?.displayName || "",
    whatsappNumber: "",
    paymentMethod: ""
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user) return;
      
      try {
        // Check discount amount
        const discountDoc = await getDoc(doc(db, "discounts", user.uid));
        // Check if discount has been used
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (discountDoc.exists() && userDoc.exists()) {
          const hasUsed = userDoc.data().hasUsedDiscount || false;
          setHasUsedDiscount(hasUsed);
          
          if (!hasUsed) {
            setOrderData(prev => ({
              ...prev,
              discount: discountDoc.data().discountPercentage
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [user]);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const updateOrderData = (newData: Partial<OrderData>) => {
    setOrderData(prev => {
      const updated = { ...prev, ...newData };
      const totalPrice = calculateOrderPrice(updated);
      return { ...updated, totalPrice };
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-black border border-primary rounded-lg">
      {/* Tampilkan status diskon */}
      {user && (
        <div className="mb-6 p-3 rounded-lg text-center">
          {hasUsedDiscount ? (
            <p className="text-yellow-500">
              ⚠️ Anda sudah menggunakan diskon sebelumnya
            </p>
          ) : orderData.discount ? (
            <p className="text-green-500">
              🎉 Diskon {orderData.discount}% akan diterapkan pada pesanan ini
            </p>
          ) : (
            <p className="text-gray-400">
              💡 Berikan testimoni untuk mendapatkan diskon!
            </p>
          )}
        </div>
      )}

      {/* Steps */}
      {step === 1 && (
        <Step1 
          orderData={orderData} 
          updateOrderData={updateOrderData} 
          nextStep={nextStep} 
        />
      )}
      {step === 2 && (
        <Step2 
          orderData={orderData} 
          updateOrderData={updateOrderData}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}
      {step === 3 && (
        <>
          {orderData.projectType === "A" && (
            <Step3A 
              orderData={orderData}
              updateOrderData={updateOrderData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {(orderData.projectType === "B" || orderData.projectType === "C") && (
            <Step3B
              orderData={orderData}
              updateOrderData={updateOrderData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {orderData.projectType === "D" && (
            <Step3C
              orderData={orderData}
              updateOrderData={updateOrderData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
        </>
      )}
      {step === 4 && (
        <Step4
          orderData={orderData}
          updateOrderData={updateOrderData}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}
      {step === 5 && (
        <OrderSummary
          orderData={orderData}
          prevStep={prevStep}
        />
      )}
    </div>
  );
};

export default OrderForm;
