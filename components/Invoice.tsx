"use client";
import { useProjectStore } from "@/zustand/useProjectStore";
import { useProfileStore } from "@/zustand/userProfileStore";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useRef, useState, useEffect } from "react";

// Type definitions
interface Service {
  service_price?: string | number;
  // Add other service properties as needed
}

interface ProjectLog {
  markdown?: string;
  hour?: number;
  minute?: number;
  rate?: number;
  // Add other log properties as needed
}

interface ProjectData {
  _id?: string;
  clientName?: string;
  userName?: string;
  duration?: string;
  services?: Service[];
  hourlyRate?: number;
  totalBill?: number | string;
  bidAmount?: number | string;
  tax_rate?: number | string;
  projectLogs?: ProjectLog[];
  // Add other project properties as needed
}

interface UserProfile {
  userLanguage?: string;
  // Add other user properties as needed
}

const Invoice = () => {
  const params = useSearchParams();
  const { user } = useProfileStore() as { user: UserProfile | null };
  const { data: session } = useSession();
  const invoiceId = params.get("invoiceid");
  const { projects } = useProjectStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const projectData: ProjectData | undefined = projects.find((project: ProjectData) => project._id === invoiceId);

  if (!projectData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md">
          <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📄</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Invoice Not Found
          </h2>
          <p className="text-gray-600">
            The requested invoice could not be found.
          </p>
        </div>
      </div>
    );
  }

  // Calculate totals with proper type handling
  const hostingSubtotal =
    projectData.services?.reduce(
      (sum: number, item: Service) => sum + Number(item.service_price || 0),
      0
    ) || 0;

  const isHourly = !!projectData.hourlyRate;
  const baseAmount = isHourly
    ? Number(projectData.totalBill || 0)
    : Number(projectData.bidAmount || 0);

  const subtotal = baseAmount + hostingSubtotal;
  const taxRate = Number(projectData.tax_rate || 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  const ref = useRef<HTMLDivElement>(null);

  const downloadPdf = async (): Promise<void> => {
    if (!ref.current) return;

    setIsGenerating(true);
    try {
      const element = ref.current;
      
      // Create a clone for PDF generation
      const clone = element.cloneNode(true) as HTMLElement;
      
      // Apply PDF-optimized styles
      clone.style.width = '794px';
      clone.style.height = 'auto';
      clone.style.padding = '40px 20px';
      clone.style.margin = '0';
      clone.style.borderRadius = '0';
      clone.style.boxShadow = 'none';
      clone.style.transform = 'scale(1)';
      clone.style.position = 'fixed';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.zIndex = '-1000';
      clone.style.background = '#ffffff';
      clone.style.overflow = 'visible';
      
      // Apply PDF styles to all children
      const applyPdfStyles = (el: HTMLElement): void => {
        // Remove problematic styles
        el.style.boxShadow = 'none';
        el.style.borderRadius = '0';
        el.style.backdropFilter = 'none';
        el.style.backgroundImage = 'none';
        el.style.transform = 'none';
        el.style.overflow = 'visible';
        
        // Replace gradients with solid colors for better PDF rendering
        if (el.style.background && el.style.background.includes('gradient')) {
          if (el.style.background.includes('blue-600') || el.style.background.includes('purple-600')) {
            el.style.background = '#4f46e5';
            el.style.color = '#ffffff';
          } else {
            el.style.background = '#f8fafc';
          }
        }
        
        // Ensure good contrast
        if (el.classList.contains('bg-gradient-to-br')) {
          if (el.classList.contains('from-blue-50') || el.classList.contains('to-indigo-50')) {
            el.style.background = '#eff6ff';
          } else if (el.classList.contains('from-green-50') || el.classList.contains('to-emerald-50')) {
            el.style.background = '#f0fdf4';
          } else if (el.classList.contains('from-slate-50') || el.classList.contains('to-blue-50')) {
            el.style.background = '#f8fafc';
          }
        }
        
        // Process children
        Array.from(el.children).forEach(child => 
          applyPdfStyles(child as HTMLElement)
        );
      };
      
      applyPdfStyles(clone);
      document.body.appendChild(clone);

      // Wait for the clone to be rendered
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: 794,
        height: clone.scrollHeight,
        windowWidth: 794,
        windowHeight: clone.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc: Document, clonedElement: HTMLElement) => {
          // Additional optimization for the cloned element
          const allElements = clonedElement.querySelectorAll('*');
          allElements.forEach((el: Element) => {
            const htmlEl = el as HTMLElement;
            htmlEl.style.boxShadow = 'none';
            htmlEl.style.borderRadius = '0';
            htmlEl.style.backdropFilter = 'none';
            htmlEl.style.overflow = 'visible';
            
            // Replace gradients with solid colors
            if (htmlEl.style.background && htmlEl.style.background.includes('gradient')) {
              if (htmlEl.style.background.includes('blue-600') || htmlEl.style.background.includes('purple-600')) {
                htmlEl.style.background = '#4f46e5';
                htmlEl.style.color = '#ffffff';
              } else {
                htmlEl.style.background = '#f8fafc';
              }
            }
            
            // Handle specific gradient classes
            const classList = Array.from(htmlEl.classList);
            if (classList.some(cls => cls.includes('bg-gradient'))) {
              if (classList.some(cls => cls.includes('from-blue-600') || cls.includes('to-purple-600'))) {
                htmlEl.style.background = '#4f46e5';
                htmlEl.style.color = '#ffffff';
              } else if (classList.some(cls => cls.includes('from-gray-50') || cls.includes('to-gray-100'))) {
                htmlEl.style.background = '#f9fafb';
              } else if (classList.some(cls => cls.includes('from-gray-800') || cls.includes('to-gray-900'))) {
                htmlEl.style.background = '#1f2937';
                htmlEl.style.color = '#ffffff';
              }
            }
          });
        }
      });

      // Clean up clone
      document.body.removeChild(clone);

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calculate dimensions to fit page width with proper margins
      const margin = 10;
      const imgWidth = pageWidth - (2 * margin);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Check if content needs multiple pages
      let heightLeft = imgHeight;
      let position = margin;

      // Add first page
      pdf.addImage(
        canvas.toDataURL("image/png", 1.0),
        "PNG",
        margin,
        position,
        imgWidth,
        imgHeight,
        undefined,
        'FAST'
      );

      heightLeft -= pageHeight;

      // Add new pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL("image/png", 1.0),
          "PNG",
          margin,
          position,
          imgWidth,
          imgHeight,
          undefined,
          'FAST'
        );
        heightLeft -= pageHeight;
      }

      pdf.save(
        `Invoice-${projectData.clientName || 'Unknown'}-${new Date().toISOString().split("T")[0]}.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Fallback to simple print if PDF generation fails
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading your invoice...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 no-print">
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Invoice Preview
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <span className="text-lg">✨</span>
              Professional invoice ready for download
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => window.print()}
              className="min-w-[140px] bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              🖨️ Print
            </button>
            <button
              onClick={downloadPdf}
              disabled={isGenerating}
              className="min-w-[160px] bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  📥 Download PDF
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Invoice Container */}
        <div className="flex justify-center">
          <div
            ref={ref}
            id="invoice-content"
            className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden print:shadow-none print:border-none print:rounded-none print:max-w-none"
            style={{ minHeight: 'auto' }}
          >
            {/* Premium Header - Simplified for PDF */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-6 text-white print:bg-gray-800 print:p-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center print:bg-gray-700">
                      <span className="text-xl">📋</span>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold mb-1 print:text-xl">INVOICE</h1>
                      <p className="text-blue-100 text-sm opacity-90 print:text-gray-300">
                        Professional Services Rendered
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/20 print:bg-gray-700 print:border-gray-600">
                    <p className="text-lg font-bold mb-1 print:text-white">
                      {(projectData.clientName || 'Unknown Client').toUpperCase()}
                    </p>
                    <p className="text-blue-200 text-xs opacity-80 font-medium print:text-gray-400">CLIENT</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-6 border-b border-gray-200 print:p-4 print:gap-3">
              {/* Invoice Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <h2 className="text-lg font-semibold text-gray-800 print:text-base">Invoice Details</h2>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 print:bg-gray-50 print:border-gray-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center py-1 border-b border-blue-200/50">
                      <span className="text-gray-600 font-medium">Invoice Number</span>
                      <span className="font-semibold text-gray-800">
                        INV-{new Date().getFullYear()}-
                        {projectData._id?.slice(-8).toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-blue-200/50">
                      <span className="text-gray-600 font-medium">Issue Date</span>
                      <span className="text-gray-800 font-medium">
                        {new Date().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-600 font-medium">Due Date</span>
                      <span className="text-red-600 font-semibold">
                        {projectData.duration || 'Upon receipt'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* From Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <h2 className="text-lg font-semibold text-gray-800 print:text-base">From</h2>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100 print:bg-gray-50 print:border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center print:bg-gray-600">
                      <span className="text-white font-bold">👤</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 mb-1 print:text-sm">
                        {projectData.userName || 'Unknown User'}
                      </p>
                      <p className="text-gray-600 text-xs mb-2 font-medium">
                        Professional Freelancer
                      </p>
                      {session?.user?.email && (
                        <div className="text-gray-500 text-xs">
                          <span className="font-medium">{session.user.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Section */}
            <div className="p-6 border-b border-gray-200 print:p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <h2 className="text-xl font-semibold text-gray-800 print:text-lg">
                  {isHourly ? "Hourly Services" : "Fixed Project Services"}
                </h2>
              </div>
              
              <div className="overflow-hidden rounded-xl border border-gray-200 print:rounded-none print:border-gray-300">
                <table className="w-full text-sm print:text-xs">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 print:bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left font-bold text-gray-700 uppercase tracking-wider">
                        Description
                      </th>
                      {isHourly && (
                        <>
                          <th className="py-3 px-4 text-center font-bold text-gray-700 uppercase tracking-wider">
                            Hours
                          </th>
                          <th className="py-3 px-4 text-center font-bold text-gray-700 uppercase tracking-wider">
                            Minutes
                          </th>
                          <th className="py-3 px-4 text-right font-bold text-gray-700 uppercase tracking-wider">
                            Rate
                          </th>
                        </>
                      )}
                      <th className="py-3 px-4 text-right font-bold text-gray-700 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {projectData.projectLogs?.map((log: ProjectLog, idx: number) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 transition-colors duration-200 even:bg-gray-50/50 print:even:bg-gray-50"
                      >
                        <td className="py-3 px-4 text-gray-700">
                          <div className="max-w-md font-medium print:max-w-xs">
                            {log.markdown || 'No description'}
                          </div>
                        </td>
                        {isHourly && (
                          <>
                            <td className="py-3 px-4 text-center text-gray-600 font-semibold">
                              {log.hour || 0}
                            </td>
                            <td className="py-3 px-4 text-center text-gray-600 font-semibold">
                              {log.minute || 0}
                            </td>
                            <td className="py-3 px-4 text-right text-gray-600 font-medium">
                              {user?.userLanguage || '$'} {projectData.hourlyRate?.toFixed(2) || '0.00'}
                            </td>
                          </>
                        )}
                        <td className="py-3 px-4 text-right font-bold text-blue-600 print:text-blue-700">
                          {user?.userLanguage || '$'} {(log.rate || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals Section */}
            <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 border-b border-gray-200 print:p-4 print:bg-gray-50">
              <div className="flex justify-center">
                <div className="w-full max-w-md space-y-3 bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-gray-200 print:bg-white print:border-gray-300">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Payment Summary</h3>
                    <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center py-1 border-b border-gray-300">
                      <span className="text-gray-600 font-medium">Base Amount:</span>
                      <span className="font-semibold text-gray-800">
                        {user?.userLanguage || '$'} {baseAmount.toFixed(2)}
                      </span>
                    </div>
                    
                    {hostingSubtotal > 0 && (
                      <div className="flex justify-between items-center py-1 border-b border-gray-300">
                        <span className="text-gray-600 font-medium">Hosting Charges:</span>
                        <span className="font-semibold text-gray-800">
                          {user?.userLanguage || '$'} {hostingSubtotal.toFixed(2)}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center py-1 border-b border-gray-300">
                      <span className="text-gray-600 font-medium">Subtotal:</span>
                      <span className="font-semibold text-gray-800">
                        {user?.userLanguage || '$'} {subtotal.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-1 border-b border-gray-300">
                      <span className="text-gray-600 font-medium">Tax ({taxRate}%):</span>
                      <span className="text-red-600 font-semibold">
                        {user?.userLanguage || '$'} {taxAmount.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-3 border-t-2 border-gray-400 mt-3">
                      <span className="font-bold text-gray-800">Total Amount:</span>
                      <span className="text-lg font-bold text-blue-600 print:text-blue-700">
                        {user?.userLanguage || '$'} {total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 text-center print:bg-gray-800 print:p-4">
              <div className="max-w-2xl mx-auto">
                <p className="font-semibold mb-2 print:text-sm">
                  Thank you for your business!
                </p>
                <p className="text-gray-400 text-xs mb-3 max-w-md mx-auto leading-relaxed print:text-gray-300">
                  This is a computer-generated invoice. No signature required. 
                  We appreciate the opportunity to serve you.
                </p>
                <div className="text-gray-500 text-xs print:text-gray-400">
                  <span>bonhive.site • Professional Freelancing Services</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Download Hint */}
        <div className="text-center mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 no-print">
          <p className="text-gray-700 font-medium flex items-center justify-center gap-2">
            <span className="text-xl">💡</span>
            <strong>Pro Tip:</strong> For best results, use the "Download PDF" button. 
            The invoice is optimized to fit perfectly on A4 paper.
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
            margin: 0 !important;
            padding: 0 !important;
          }
          #invoice-content,
          #invoice-content * {
            visibility: visible;
          }
          #invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            min-height: auto !important;
            background: white !important;
            transform: none !important;
          }
          .no-print {
            display: none !important;
          }
          /* Ensure proper spacing for print */
          #invoice-content > div {
            margin: 0 !important;
            padding: 8px !important;
          }
          /* Improve text readability for print */
          #invoice-content {
            font-size: 12px !important;
            line-height: 1.2 !important;
          }
          /* Force background colors for print */
          #invoice-content .bg-gradient-to-r {
            background: #4f46e5 !important;
            color: white !important;
          }
          #invoice-content .bg-gradient-to-br {
            background: #f8fafc !important;
          }
        }

        /* Ensure the invoice container has proper dimensions */
        #invoice-content {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default Invoice;