"use client";

import { useState, useEffect } from "react";
import { Search, Globe, Server, Cloud, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { useMemo } from "react";
import useDebounce from "@/hooks/use-debounce";

interface DomainSuggestion {
  domain: string;
  available: boolean;
  price: string;
  priceValue: number;
  definitive: boolean;
  tld: string;
  id: string;
}

interface CartItem {
  id: string;
  domain: string;
  price: string;
  priceValue: number;
}

export default function DomainSearchPage() {
  const [domain, setDomain] = useState("");
  const debouncedDomain = useDebounce(domain, 500); // Debounce for 500ms
  const [suggestions, setSuggestions] = useState<DomainSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<Map<string, CartItem>>(new Map());

  useEffect(() => {
    if (debouncedDomain) {
      handleSearch(debouncedDomain);
    }
  }, [debouncedDomain]);

  const handleSearch = async (searchDomain: string) => {
    if (!searchDomain) {
      setError("Please enter a domain name");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Using the App Router API route instead of Pages API route
      const response = await fetch(`/api/godaddy-search?domain=${encodeURIComponent(searchDomain)}`);
      const data = await response.json();

      if (response.ok) {
        if (data.suggestions && data.suggestions.length > 0) {
          setSuggestions(data.suggestions);
        } else {
          setSuggestions([]);
          setError("No domain suggestions found. Try a different search term.");
        }
      } else {
        setError(data.message || "An error occurred during domain search.");
      }
    } catch (err) {
      console.error("Domain search error:", err);
      setError("Failed to connect to the domain search service. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (suggestion: DomainSuggestion) => {
    if (cart.has(suggestion.id)) {
      toast({ title: "Already in cart", variant: "destructive" });
      return;
    }
    const newItem: CartItem = { id: suggestion.id, domain: suggestion.domain, price: suggestion.price, priceValue: suggestion.priceValue };
    setCart(new Map(cart.set(suggestion.id, newItem)));
    toast({ title: "Added to cart" });
  };

  const removeFromCart = (id: string) => {
    const newCart = new Map(cart);
    newCart.delete(id);
    setCart(newCart);
    toast({ title: "Removed from cart" });
  };

  const calculateTotal = useMemo(() => {
    return Array.from(cart.values()).reduce((total, item) => total + item.priceValue, 0);
  }, [cart]);

  const proceedToCheckout = () => {
    if (cart.size === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add at least one domain to your cart before checkout.",
        variant: "destructive"
      });
      return;
    }

    // Encode cart data to pass via URL
    const cartData = encodeURIComponent(JSON.stringify(Array.from(cart.values())));
    window.location.href = `/checkout?cart=${cartData}`;
  };

  const hostingPrices = [
    {
      name: "Hosting for WordPress",
      price: "₹149/month",
      features: [
        "Optimized for WordPress",
        "Free SSL Certificate",
        "Daily Backups",
        "24/7 Support",
      ],
      icon: <Cloud className="h-6 w-6 text-purple-600" />,
    },
    {
      name: "Web Hosting",
      price: "₹99/month",
      features: [
        "Shared Hosting",
        "Free Domain for 1st Year",
        "100 GB Storage",
        "Unmetered Bandwidth",
      ],
      icon: <Server className="h-6 w-6 text-blue-600" />,
    },
    {
      name: "VPS Hosting",
      price: "₹499/month",
      features: [
        "Virtual Private Server",
        "Root Access",
        "High Performance",
        "Scalable Resources",
      ],
      icon: <Globe className="h-6 w-6 text-green-600" />,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Find Your Perfect Domain
          </h1>
          <div className="relative">
            <Button variant="outline" className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Cart
              {cart.size > 0 && (
                <Badge className="ml-1 bg-blue-500">{cart.size}</Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Domain Search Section */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Domain Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow">
                <Label htmlFor="domain-search" className="sr-only">
                  Domain Name
                </Label>
                <Input
                  id="domain-search"
                  type="text"
                  placeholder="Enter domain name (e.g., example.com)"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(domain);
                    }
                  }}
                  className="w-full"
                />
              </div>
              <Button onClick={() => handleSearch(domain)} disabled={loading}>
                {loading ? "Searching..." : <Search className="mr-2 h-4 w-4" />}
                {loading ? "" : "Search Domain"}
              </Button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            {/* Cart Section */}
            {cart.size > 0 && (
              <div className="mt-8 p-4 border rounded-lg bg-white">
                <h2 className="text-xl font-bold mb-4">Your Cart</h2>
                <div className="space-y-2">
                  {Array.from(cart.values()).map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-2 border-b">
                      <div>
                        <p className="font-medium">{item.domain}</p>
                        <p className="text-sm text-gray-600">{item.price}</p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4 font-bold">
                    <span>Total:</span>
                    <span>₹{calculateTotal}</span>
                  </div>
                  <Button className="w-full mt-4" onClick={proceedToCheckout}>Proceed to Checkout</Button>
                </div>
              </div>
            )}

            {/* Domain Suggestions */}
            {suggestions.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Domain Suggestions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {suggestions.map((s) => (
                    <Card key={s.id} className="p-4">
                      <h3 className="text-xl font-semibold">{s.domain}</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {s.available ? (
                          <span className="text-green-600">Available</span>
                        ) : (
                          <span className="text-red-600">Unavailable</span>
                        )}
                      </p>
                      {s.price && s.available && (
                        <p className="text-lg font-bold mt-2">{s.price}</p>
                      )}
                      {s.available && (
                        <Button
                          className="mt-4 w-full"
                          onClick={() => addToCart(s)}
                          disabled={cart.has(s.id)}
                        >
                          {cart.has(s.id) ? "Added to Cart" : "Add to Cart"}
                        </Button>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {error && <p className="text-red-500 mt-4">Error: {error}</p>}

            {/* Hosting Plans Section */}
            <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
              <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                      Affordable Hosting Plans
                    </h2>
                    <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                      Choose the perfect hosting plan for your website.
                    </p>
                  </div>
                </div>
                <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                  <Card className="flex flex-col justify-between p-6">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold">Hosting for WordPress</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Optimized hosting for your WordPress website.
                      </p>
                      <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                        <li>
                          <CheckIcon className="mr-2 inline-block h-4 w-4 text-green-500" />1
                          Website
                        </li>
                        <li>
                          <CheckIcon className="mr-2 inline-block h-4 w-4 text-green-500" />30
                          GB Storage
                        </li>
                        <li>
                          <CheckIcon className="mr-2 inline-block h-4 w-4 text-green-500" />Unmetered
                          Bandwidth
                        </li>
                      </ul>
                    </div>
                    <div className="mt-6">
                      <p className="text-4xl font-bold">₹149/month</p>
                      <Button className="mt-4 w-full">Get Started</Button>
                    </div>
                  </Card>
                  <Card className="flex flex-col justify-between p-6">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold">Web Hosting</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Reliable hosting for all your website needs.
                      </p>
                      <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                        <li>
                          <CheckIcon className="mr-2 inline-block h-4 w-4 text-green-500" />Unlimited
                          Websites
                        </li>
                        <li>
                          <CheckIcon className="mr-2 inline-block h-4 w-4 text-green-500" />100
                          GB Storage
                        </li>
                        <li>
                          <CheckIcon className="mr-2 inline-block h-4 w-4 text-green-500" />Unmetered
                          Bandwidth
                        </li>
                      </ul>
                    </div>
                    <div className="mt-6">
                      <p className="text-4xl font-bold">₹299/month</p>
                      <Button className="mt-4 w-full">Get Started</Button>
                    </div>
                  </Card>
                  <Card className="flex flex-col justify-between p-6">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold">VPS Hosting</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Powerful and flexible virtual private server hosting.
                      </p>
                      <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                        <li>
                          <CheckIcon className="mr-2 inline-block h-4 w-4 text-green-500" />2
                          CPU Cores
                        </li>
                        <li>
                          <CheckIcon className="mr-2 inline-block h-4 w-4 text-green-500" />4
                          GB RAM
                        </li>
                        <li>
                          <CheckIcon className="mr-2 inline-block h-4 w-4 text-green-500" />80
                          GB SSD Storage
                        </li>
                      </ul>
                    </div>
                    <div className="mt-6">
                      <p className="text-4xl font-bold">₹999/month</p>
                      <Button className="mt-4 w-full">Get Started</Button>
                    </div>
                  </Card>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function CheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}