"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  CreditCard, 
  Wallet, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import Script from "next/script";

interface CartItem {
  id: string;
  domain: string;
  price: string;
  priceValue: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Load cart from URL params
  useEffect(() => {
    try {
      const cartParam = searchParams.get("cart");
      if (cartParam) {
        const decodedCart = JSON.parse(decodeURIComponent(cartParam));
        if (Array.isArray(decodedCart) && decodedCart.length > 0) {
          setCart(decodedCart);
        } else {
          // Redirect if cart is empty
          router.push("/domain-search");
        }
      } else {
        // Redirect if no cart parameter
        router.push("/domain-search");
      }
    } catch (error) {
      console.error("Error parsing cart data:", error);
      router.push("/domain-search");
    }
  }, [searchParams, router]);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.priceValue, 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (paymentMethod === "credit-card") {
      if (!cardDetails.cardNumber.trim()) {
        newErrors.cardNumber = "Card number is required";
      } else if (!/^\d{16}$/.test(cardDetails.cardNumber.replace(/\s/g, ""))) {
        newErrors.cardNumber = "Invalid card number";
      }
      
      if (!cardDetails.cardName.trim()) {
        newErrors.cardName = "Name on card is required";
      }
      
      if (!cardDetails.expiryDate.trim()) {
        newErrors.expiryDate = "Expiry date is required";
      } else if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
        newErrors.expiryDate = "Use format MM/YY";
      }
      
      if (!cardDetails.cvv.trim()) {
        newErrors.cvv = "CVV is required";
      } else if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
        newErrors.cvv = "Invalid CVV";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Please check your payment details",
        description: "Some fields contain errors or are missing.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: calculateTotal() * 100, // Razorpay expects amount in paisa
          currency: "INR",
          cart: cart,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
          amount: data.amount,
          currency: data.currency,
          name: "TechZolo",
          description: "Domain Registration Payment",
          order_id: data.id, // For one-time payment
          handler: async function (response: any) {
            // Verify payment on backend
            const verifyResponse = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                cart: cart,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok && verifyData.success) {
              toast({
                title: "Payment successful!",
                description: "Your order has been processed successfully.",
              });
              router.push("/dashboard");
            } else {
              toast({
                title: "Payment failed",
                description: verifyData.message || "Payment verification failed.",
                variant: "destructive",
              });
            }
          },
          prefill: {
            name: cardDetails.cardName, // User's name
            email: "", // User's email
            contact: "", // User's phone
          },
          notes: {
            address: "TechZolo Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        toast({
          title: "Payment initiation failed",
          description: data.message || "Could not create Razorpay order.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during payment process:", error);
      toast({
        title: "An unexpected error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const goBack = () => {
    router.push("/domain-search");
  };

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={goBack} 
          className="mb-6 flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Domain Search
        </Button>
        
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
          Checkout
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-1">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{item.domain}</p>
                        <p className="text-sm text-gray-500">Domain Registration</p>
                      </div>
                      <p className="font-medium">{item.price}</p>
                    </div>
                  ))}
                  
                  <div className="flex justify-between pt-2 font-bold">
                    <span>Total</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Payment Options */}
          <div className="md:col-span-2">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={setPaymentMethod}
                    className="space-y-4 mb-6"
                  >
                    <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card" className="flex items-center cursor-pointer">
                        <CreditCard className="mr-2 h-5 w-5 text-blue-600" />
                        Credit / Debit Card
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex items-center cursor-pointer">
                        <Wallet className="mr-2 h-5 w-5 text-green-600" />
                        UPI / Digital Wallet
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="net-banking" id="net-banking" />
                      <Label htmlFor="net-banking" className="flex items-center cursor-pointer">
                        <ShieldCheck className="mr-2 h-5 w-5 text-purple-600" />
                        Net Banking
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  {paymentMethod === "credit-card" && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.cardNumber}
                          onChange={handleInputChange}
                          className={errors.cardNumber ? "border-red-500" : ""}
                        />
                        {errors.cardNumber && (
                          <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          placeholder="John Doe"
                          value={cardDetails.cardName}
                          onChange={handleInputChange}
                          className={errors.cardName ? "border-red-500" : ""}
                        />
                        {errors.cardName && (
                          <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={cardDetails.expiryDate}
                            onChange={handleInputChange}
                            className={errors.expiryDate ? "border-red-500" : ""}
                          />
                          {errors.expiryDate && (
                            <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={handleInputChange}
                            className={errors.cvv ? "border-red-500" : ""}
                          />
                          {errors.cvv && (
                            <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {paymentMethod === "upi" && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="upiId">UPI ID</Label>
                        <Input
                          id="upiId"
                          placeholder="yourname@upi"
                        />
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Secure and instant payment</span>
                      </div>
                    </div>
                  )}
                  
                  {paymentMethod === "net-banking" && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="bank">Select Bank</Label>
                        <select 
                          id="bank" 
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="">Select your bank</option>
                          <option value="sbi">State Bank of India</option>
                          <option value="hdfc">HDFC Bank</option>
                          <option value="icici">ICICI Bank</option>
                          <option value="axis">Axis Bank</option>
                          <option value="kotak">Kotak Mahindra Bank</option>
                        </select>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-8">
                    <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
                      <ShieldCheck className="h-4 w-4 text-green-500" />
                      <span>Your payment information is secure and encrypted</span>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : `Pay ₹${calculateTotal()}`}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}