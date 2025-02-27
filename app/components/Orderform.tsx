"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { OrderData } from "../../lib/types/order";
import { calculateOrderPrice } from "../../lib/utils/priceCalculator";
import Step1 from "./OrderSteps/Step1";
import Step2 from "./OrderSteps/Step2";
import Step3A from "./OrderSteps/Step3A";
import Step3B from "./OrderSteps/Step3B";
import Step3C from "./OrderSteps/Step3C";
import Step4 from "./OrderSteps/Step4";
import OrderSummary from "./OrderSteps/OrderSummary";

const OrderForm = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState<OrderData>({
    projectType: "",
    projectName: "",
    platform: "",
    applicationType: "",
    customerName: user?.displayName || "",
    whatsappNumber: "",
    paymentMethod: ""
  });
  const [userDiscount, setUserDiscount] = useState<number>(0);

  useEffect(() => {
    const fetchUserDiscount = async () => {
      if (!user) return;
      
      try {
        const discountDoc = await getDoc(doc(db, "discounts", user.uid));
        if (discountDoc.exists()) {
          setUserDiscount(discountDoc.data().discountPercentage);
          setOrderData(prev => ({
            ...prev,
            discount: discountDoc.data().discountPercentage
          }));
        }
      } catch (error) {
        console.error("Error fetching discount:", error);
      }
    };

    fetchUserDiscount();
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

      {/* Tampilkan diskon jika ada */}
      {userDiscount > 0 && (
        <div className="mt-4 p-2 bg-green-500 bg-opacity-10 border border-green-500 rounded-lg text-center">
          <p className="text-green-500">
            Anda memiliki diskon {userDiscount}% dari testimonial!
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderForm;
