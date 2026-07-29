"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface AgreementData {
  id: number;
  lead_name: string;
  lead_email: string;
  facility: string;
  room_number: string | null;
  move_in_date: string;
  monthly_fee: number;
  security_deposit: number | null;
  terms_conditions: string | null;
  agreement_number: string;
}

export default function SignAgreementPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [agreement, setAgreement] = useState<AgreementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [signed, setSigned] = useState(false);
  const [error, setError] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    fetchAgreement();
  }, [token]);

  // ✅ Canvas initialization using callback ref
  const setCanvasRef = (node: HTMLCanvasElement | null) => {
    if (node) {
      canvasRef.current = node;
      const ctx = node.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = "#1f2937";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctxRef.current = ctx;
        
        // Fill white background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, node.width, node.height);
        console.log("✅ Canvas initialized successfully");
      } else {
        console.log("❌ Could not get 2D context");
      }
    }
  };

  const fetchAgreement = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/agreements/public/${token}`
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to load agreement");
      }
      const data = await response.json();
      setAgreement(data);
    } catch (err: any) {
      setError(err.message || "Invalid or expired agreement link");
    } finally {
      setLoading(false);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) {
      console.log("❌ Canvas or context not found");
      return;
    }
    
    isDrawingRef.current = true;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const getSignatureData = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.toDataURL("image/png");
  };

  const handleSubmit = async () => {
    const signatureData = getSignatureData();
    if (!signatureData) {
      setError("Please sign the agreement first");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8000/api/agreements/public/sign/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ signature_image: signatureData }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to sign agreement");
      }

      setSigned(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit signature");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-12 pb-8">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Invalid Link</h2>
            <p className="text-gray-600 mt-2">{error}</p>
            <Button className="mt-6" onClick={() => router.push("/")}>
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (signed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-12 pb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Agreement Signed!</h2>
            <p className="text-gray-600 mt-2">
              Thank you for signing the agreement. You will receive a confirmation email shortly.
            </p>
            <Button className="mt-6" onClick={() => router.push("/")}>
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!agreement) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sign Your Agreement</h1>
          <p className="text-gray-600 mt-2">
            Please review the agreement below and sign to confirm.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Agreement Details */}
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900">
                  RETIREES PARADISE
                </h2>
                <h3 className="text-lg font-semibold text-gray-800">
                  RESIDENCY AGREEMENT
                </h3>
                <p className="text-sm text-gray-500">
                  {agreement.agreement_number}
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">
                  This agreement is made between <strong>Retirees Paradise</strong> and{" "}
                  <strong>{agreement.lead_name}</strong>.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-500">Facility:</span>
                <span className="font-medium">{agreement.facility}</span>
                <span className="text-gray-500">Room:</span>
                <span className="font-medium">{agreement.room_number || "Not specified"}</span>
                <span className="text-gray-500">Move-in Date:</span>
                <span className="font-medium">
                  {new Date(agreement.move_in_date).toLocaleDateString()}
                </span>
                <span className="text-gray-500">Monthly Fee:</span>
                <span className="font-medium">${agreement.monthly_fee.toLocaleString()}</span>
                {agreement.security_deposit && (
                  <>
                    <span className="text-gray-500">Security Deposit:</span>
                    <span className="font-medium">${agreement.security_deposit.toLocaleString()}</span>
                  </>
                )}
              </div>

              {agreement.terms_conditions && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Terms & Conditions</h4>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {agreement.terms_conditions}
                  </div>
                </div>
              )}

              {/* Signature */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-sm text-gray-700 mb-2">
                  ✍️ Signature
                </h4>
                <p className="text-sm text-gray-500 mb-3">
                  Click and drag on the canvas below to sign.
                </p>

                <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
                  <canvas
                    ref={setCanvasRef}
                    width={600}
                    height={200}
                    className="w-full touch-none cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                </div>

                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearSignature}
                  >
                    Clear Signature
                  </Button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Button
                type="button"
                size="lg"
                className="w-full"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Submitting...
                  </>
                ) : (
                  "Sign Agreement"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}