"use client";
import { useProjectStore } from "@/zustand/useProjectStore";
import { useProfileStore } from "@/zustand/userProfileStore";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

const Invoice = () => {
  const params = useSearchParams();
  const { user } = useProfileStore();
  const{data:session} = useSession()
  const invoiceId = params.get("invoiceid");
  const { projects } = useProjectStore();
  const [isGenerating, setIsGenerating] = useState(false);

  // Calculate financial data
  const hostingSubtotal = projects
    .filter((fil) => fil._id == invoiceId)
    .map((project) =>
      project.services.reduce(
        (sum, product) => sum + Number(product.service_price),
        0
      )
    )[0] || 0;

  const projectData = projects.find((project) => project._id === invoiceId);
  const subtotal = (projectData?.totalBill || 0) + hostingSubtotal;
  const taxRate = 0.1;
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  const ref = useRef<HTMLDivElement>(null);

  const downloadPdf = async () => {
    if (!ref.current) return;
    
    setIsGenerating(true);
    try {
      const element = ref.current;
      
      // Clone the element to avoid affecting the original display
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.width = "210mm";
      clone.style.margin = "0";
      document.body.appendChild(clone);
      
      const canvas = await html2canvas(clone, { 
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });
      
      document.body.removeChild(clone);

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgData = canvas.toDataURL("image/png", 1.0);
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Invoice-${invoiceId}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!projectData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Invoice Not Found</h2>
          <p className="text-gray-500">The requested invoice could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoice Preview</h1>
            <p className="text-gray-600 mt-2">Review and download your invoice</p>
          </div>
          <button 
            onClick={downloadPdf} 
             
            disabled={isGenerating}
            className="min-w-[160px] bg-[#0096c7] hover:bg-blue-500 px-3 py-1 rounded-md text-white hover:scale-105 transition duration-300 cursor-pointer"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating PDF...
              </span>
            ) : (
              "Download PDF"
            )}
          </button>
        </div>

        {/* Invoice Container */}
        <div className="flex justify-center">
          <div
            ref={ref}
            className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 text-white">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-indigo-200 font-medium">ACTIVE INVOICE</span>
                  </div>
                  <h1 className="text-4xl font-bold mb-2">INVOICE</h1>
                  <p className="text-indigo-200 text-lg">
                    For professional services rendered
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold bg-white/10 px-4 py-2 rounded-lg inline-block">
                    {projectData.clientName.toUpperCase()}
                  </p>
                  <p className="text-indigo-200 mt-2">Client</p>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 border-b border-gray-200">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    Invoice Details
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Invoice Number</span>
                      <span className="font-semibold text-gray-800">
                        #INV{new Date().getFullYear()}-{projectData._id.slice(-6)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Invoice Date</span>
                      <span className="text-gray-700">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="font-medium text-gray-600">Due Date</span>
                      <span className="text-red-600 font-semibold bg-red-50 px-3 py-1 rounded-full text-sm">
                        {projectData.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    From
                  </h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-800 text-lg">{projectData.userName}</p>
                    <p className="text-gray-600">Professional Freelancer</p>
                    {session?.user.email && (
                      <p className="text-gray-500 text-sm mt-1">{session.user.email}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Services */}
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Professional Services
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <th className="py-4 px-4 text-left font-semibold text-gray-700 border-b">Description</th>
                      <th className="py-4 px-4 text-center font-semibold text-gray-700 border-b">Hours</th>
                      <th className="py-4 px-4 text-center font-semibold text-gray-700 border-b">Minutes</th>
                      <th className="py-4 px-4 text-right font-semibold text-gray-700 border-b">Hourly Rate</th>
                      <th className="py-4 px-4 text-right font-semibold text-gray-700 border-b">Rate ({user?.userLanguage})</th>
                      <th className="py-4 px-4 text-right font-semibold text-gray-700 border-b">Amount ({user?.userLanguage})</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectData.projectLogs.map((service, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-gray-700">{service.markdown}</td>
                        <td className="py-4 px-4 text-center text-gray-600">{service.hour}</td>
                        <td className="py-4 px-4 text-center text-gray-600">{service.minute}</td>
                        <td className="py-4 px-4 text-right text-gray-600">
                          {user?.userLanguage} {projectData.hourlyRate.toFixed(2)}/hour
                        </td>
                        <td className="py-4 px-4 text-right font-medium text-gray-700">
                          {user?.userLanguage} {service.rate.toFixed(2)}
                        </td>
                        <td className="py-4 px-4 text-right font-semibold text-gray-800">
                          {user?.userLanguage} {service.rate.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Hosting Services */}
            {projectData.services && projectData.services.length > 0 && (
              <div className="p-8 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  Hosting & Domain Services
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <th className="py-4 px-4 text-left font-semibold text-gray-700 border-b">Name</th>
                        <th className="py-4 px-4 text-left font-semibold text-gray-700 border-b">Type</th>
                        <th className="py-4 px-4 text-left font-semibold text-gray-700 border-b">Term</th>
                        <th className="py-4 px-4 text-right font-semibold text-gray-700 border-b">Amount ({user?.userLanguage})</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectData.services.map((product, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4 text-gray-700">{product.service_name}</td>
                          <td className="py-4 px-4 text-gray-600">{product.service_type}</td>
                          <td className="py-4 px-4 text-gray-600">{product.service_duration}</td>
                          <td className="py-4 px-4 text-right font-semibold text-gray-800">
                            {user?.userLanguage} {product.service_price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Totals */}
            <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50">
              <div className="flex justify-end">
                <div className="w-full md:w-2/3 lg:w-1/2">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <span className="font-medium text-gray-700">Services Subtotal:</span>
                      <span className="font-semibold text-gray-800">
                        {user?.userLanguage} {projectData.totalBill?.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="font-medium text-gray-700">Hosting Subtotal:</span>
                      <span className="font-semibold text-gray-800">
                        {user?.userLanguage} {hostingSubtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-t border-gray-300">
                      <span className="font-semibold text-gray-800">Subtotal:</span>
                      <span className="font-semibold text-gray-800">
                        {user?.userLanguage} {subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="font-medium text-gray-700">Tax (10%):</span>
                      <span className="font-semibold text-red-600">
                        {user?.userLanguage} {taxAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-4 bg-white rounded-lg shadow-sm px-4 border border-gray-200">
                      <span className="text-xl font-bold text-gray-900">Total Amount:</span>
                      <span className="text-xl font-bold text-indigo-600">
                        {user?.userLanguage} {total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 text-center text-white">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                <div className="text-sm">
                  <p className="font-semibold text-gray-300">Thank you for your business!</p>
                  <p className="text-gray-400">We appreciate your trust in our services</p>
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-300">bonhive.site</p>
                  <p className="text-gray-400">+91 9520611838</p>
                </div>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <p className="text-xs text-gray-500">
                  This is an computer-generated invoice. No signature required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;