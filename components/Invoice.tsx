"use client";
import { useProjectStore } from "@/zustand/useProjectStore";
import html2canvas from 'html2canvas-pro';
import jsPDF from "jspdf";
import { useSearchParams } from "next/navigation";
import { useRef } from "react";
import Button from "./UI/button";

const Invoice = () => {
  const params = useSearchParams();
  const invoiceId = params.get("invoiceid");
  const { projects } = useProjectStore();
  const hostingSubtotal = projects
    .filter((fil) => fil._id == invoiceId)
    .map((project) =>
      project.services.reduce(
        (sum, product) => sum + Number(product.service_price),
        0
      )
    )[0];


  const subtotal =
    projects
      .filter((fil) => fil._id == invoiceId)
      .map((project) => project.totalBill)[0] + hostingSubtotal;
  const taxRate = 0.1;
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;
  const clientLanguage = projects
    .filter((fil) => fil._id == invoiceId)
    .map((project) => project.clientLanguage)[0];



  const ref = useRef<HTMLDivElement>(null);

  const downloadPdf = async () => {
    const element = ref.current;
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

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

    pdf.save(`Invoice.${invoiceId}.${new Date().toISOString()}.pdf`);
  };

  return (
    <>
      <div className="p-4">
        <div className="flex flex-wrap gap-3 mb-6">
          <Button onclick={downloadPdf} varient="bgFill" className="">
            Download PDF
          </Button>
        </div>

        {projects
          .filter((project) => project._id === invoiceId)
          .map((project, index) => (
            <div
              ref={ref}
              key={index}
              className="max-w-5xl mx-auto bg-white rounded-lg shadow-xl font-sans"
            >
              {/* Header */}
              <div
                className="flex flex-col md:flex-row items-center justify-between p-6 rounded-t-lg text-white"
                style={{
                  background: "linear-gradient(to right, #4b5563, #111827)",
                }}
              >
                <div>
                  <h1 className="text-3xl font-bold">{project.userId}</h1>
                  <p className="text-blue-200">{project.userName}</p>
                </div>
                <h1 className="text-3xl font-bold mt-4 md:mt-0">INVOICE</h1>
              </div>

              {/* Invoice & Sender Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b">
                <div>
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">
                    Invoice Details
                  </h2>
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="w-40 font-medium text-gray-600">
                        Invoice Number
                      </span>
                      <span className="font-semibold">
                        #INV{new Date().getFullYear()}-{project._id}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="w-40 font-medium text-gray-600">
                        Invoice Date
                      </span>
                      <span>{new Date().toDateString()}</span>
                    </div>
                    <div className="flex">
                      <span className="w-40 font-medium text-gray-600">
                        Due Date
                      </span>
                      <span className="text-red-600 font-medium">
                        {project.duration}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">
                    From
                  </h2>
                  <p className="font-medium">{project.userName}</p>
                  <p className="text-gray-600">Freelancer</p>
                </div>
              </div>

              {/* Services Section */}
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Professional Services
                </h2>
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ backgroundColor: "#f3f4f6" }}>
                      <th className="py-3 px-4 text-left border-b">
                        Description
                      </th>
                      <th className="py-3 px-4 text-right border-b">Hours</th>
                      <th className="py-3 px-4 text-right border-b">Minutes</th>
                      <th className="py-3 px-4 text-right border-b">
                        Hourly Rate
                      </th>
                      <th className="py-3 px-4 text-right border-b">
                        Rate (₹)
                      </th>
                      <th className="py-3 px-4 text-right border-b">
                        Amount (₹)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.projectLogs.map((service, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-3 px-4">{service.markdown}</td>
                        <td className="py-3 px-4 text-right">{service.hour}</td>
                        <td className="py-3 px-4 text-right">
                          {service.minute}
                        </td>
                        <td className="py-3 px-4 text-right">
                          ₹{project.hourlyRate.toFixed(2)}/hour
                        </td>
                        <td className="py-3 px-4 text-right">
                          ₹{service.rate.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          ₹{service.rate.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Hosting Section */}
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Hosting & Domain Services
                </h2>
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ backgroundColor: "#f3f4f6" }}>
                      <th className="py-3 px-4 text-left border-b">Name</th>
                      <th className="py-3 px-4 text-left border-b">Type</th>
                      <th className="py-3 px-4 text-left border-b">Term</th>
                      <th className="py-3 px-4 text-right border-b">
                        Amount (₹)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.services?.map((product, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4">{product.service_name}</td>
                        <td className="py-3 px-4">{product.service_type}</td>
                        <td className="py-3 px-4">
                          {product.service_duration}
                        </td>
                        <td className="py-3 px-4 text-right">
                          ₹{product.service_price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="p-6 border-b">
                <div className="flex justify-end">
                  <div className="w-full md:w-1/2 lg:w-1/3">
                    <div className="flex justify-between py-2">
                      <span className="font-medium">Services Subtotal:</span>
                      <span>₹{project.totalBill?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-medium">Hosting Subtotal:</span>
                      <span>₹{hostingSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-t border-gray-300">
                      <span className="font-medium">Subtotal:</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-medium">Tax (10%):</span>
                      <span>₹{taxAmount.toFixed(2)}</span>
                    </div>
                    <div
                      className="flex justify-between py-3 border-t border-gray-300 font-semibold text-lg"
                      style={{ backgroundColor: "#eff6ff" }}
                    >
                      <span>Total Amount:</span>
                      <span>
                        {clientLanguage} {total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div
                className="p-6 text-center text-gray-500 text-sm"
                style={{ backgroundColor: "#f3f4f6" }}
              >
                <p>Thank you for your business!</p>
                <p>bonhive.live | +91 9520611838</p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default Invoice;
