import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaDownload,
  FaFileImage,
  FaFilePdf,
  FaFileCode,
  FaFileAlt,
  FaCopy,
  FaShare,
  FaCloud,
  FaGithub,
  FaSlack,
  FaEnvelope,
  FaTwitter,
  FaLinkedin,
  FaCog,
  FaEye,
} from "react-icons/fa";
import useStore from "../store";
import toast from "react-hot-toast";

const ExportManager = ({ isOpen, onClose }) => {
  const { currentProject, exportProject } = useStore();
  const [selectedFormat, setSelectedFormat] = useState("png");
  const [exportSettings, setExportSettings] = useState({
    includeBackground: true,
    quality: 1.0,
    scale: 2,
    watermark: false,
    theme: "light",
  });
  const [isExporting, setIsExporting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const exportFormats = [
    {
      id: "png",
      name: "PNG Image",
      description: "High-quality raster image with transparency",
      icon: FaFileImage,
      extension: ".png",
      type: "image",
    },
    {
      id: "jpg",
      name: "JPEG Image",
      description: "Compressed raster image, smaller file size",
      icon: FaFileImage,
      extension: ".jpg",
      type: "image",
    },
    {
      id: "svg",
      name: "SVG Vector",
      description: "Scalable vector graphics, perfect for print",
      icon: FaFileImage,
      extension: ".svg",
      type: "image",
    },
    {
      id: "pdf",
      name: "PDF Document",
      description: "Professional document format",
      icon: FaFilePdf,
      extension: ".pdf",
      type: "document",
    },
    {
      id: "json",
      name: "JSON Data",
      description: "Raw project data for import/backup",
      icon: FaFileCode,
      extension: ".json",
      type: "data",
    },
    {
      id: "markdown",
      name: "Markdown Documentation",
      description: "Technical documentation with diagrams",
      icon: FaFileAlt,
      extension: ".md",
      type: "document",
    },
    {
      id: "mermaid",
      name: "Mermaid Diagram",
      description: "Code-based diagram format",
      icon: FaFileCode,
      extension: ".mmd",
      type: "code",
    },
    {
      id: "drawio",
      name: "Draw.io XML",
      description: "Compatible with Draw.io/Lucidchart",
      icon: FaFileCode,
      extension: ".drawio",
      type: "data",
    },
  ];

  const shareOptions = [
    {
      id: "link",
      name: "Share Link",
      icon: FaShare,
      description: "Generate shareable link",
    },
    {
      id: "github",
      name: "GitHub Gist",
      icon: FaGithub,
      description: "Save as GitHub Gist",
    },
    {
      id: "slack",
      name: "Slack",
      icon: FaSlack,
      description: "Share to Slack workspace",
    },
    {
      id: "email",
      name: "Email",
      icon: FaEnvelope,
      description: "Send via email",
    },
    {
      id: "twitter",
      name: "Twitter",
      icon: FaTwitter,
      description: "Share on Twitter",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: FaLinkedin,
      description: "Share on LinkedIn",
    },
  ];

  const handleExport = async (isPreview = false) => {
    if (!currentProject) {
      toast.error("No project to export");
      return;
    }

    setIsExporting(true);

    try {
      let dataUrl;
      switch (selectedFormat) {
        case "png":
        case "jpg":
          dataUrl = await exportAsImage(isPreview);
          break;
        case "svg":
          dataUrl = await exportAsSVG(isPreview);
          break;
        case "pdf":
          await exportAsPDF();
          break;
        case "json":
          exportAsJSON();
          break;
        case "markdown":
          exportAsMarkdown();
          break;
        case "mermaid":
          exportAsMermaid();
          break;
        case "drawio":
          exportAsDrawIO();
          break;
        default:
          throw new Error("Unsupported export format");
      }

      if (isPreview && dataUrl) {
        setPreviewUrl(dataUrl);
      } else if (!isPreview && dataUrl) {
        downloadFile(dataUrl, `${currentProject.name}.${selectedFormat}`);
        toast.success(`Project exported as ${selectedFormat.toUpperCase()}`);
      } else if (!isPreview && !["pdf", "json", "markdown", "mermaid", "drawio"].includes(selectedFormat)) {
        // Should not happen for image formats if they return dataUrl
      }

    } catch (error) {
      console.error("Export error:", error);
      toast.error("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const getNodesBounds = () => {
    const { nodes } = currentProject;
    if (!nodes || nodes.length === 0) return null;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    nodes.forEach(node => {
      const x = node.position.x;
      const y = node.position.y;
      const w = node.width || 150; // Fallback width
      const h = node.height || 50; // Fallback height

      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x + w > maxX) maxX = x + w;
      if (y + h > maxY) maxY = y + h;
    });

    // Add some padding
    const padding = 50;
    return {
      x: minX - padding,
      y: minY - padding,
      width: maxX - minX + (padding * 2),
      height: maxY - minY + (padding * 2)
    };
  };

  const exportAsImage = async (returnUrl = false) => {
    try {
      const canvasElement = document.querySelector(".react-flow__viewport");
      if (!canvasElement) {
        throw new Error("Canvas not found");
      }

      const bounds = getNodesBounds();
      const width = bounds ? bounds.width : canvasElement.offsetWidth;
      const height = bounds ? bounds.height : canvasElement.offsetHeight;

      // Helper to get image data based on format
      const getImageData = async () => {
        const options = {
          backgroundColor: exportSettings.includeBackground ? "#ffffff" : null,
          quality: exportSettings.quality,
          pixelRatio: exportSettings.scale,
          width: width,
          height: height,
          style: {
            width: width + "px",
            height: height + "px",
            transform: bounds ? `translate(${-bounds.x}px, ${-bounds.y}px)` : undefined
          }
        };

        const { toPng, toJpeg } = await import("html-to-image");

        if (selectedFormat === "jpg") {
          return await toJpeg(canvasElement, options);
        } else {
          return await toPng(canvasElement, options);
        }
      };

      const dataUrl = await getImageData();

      if (returnUrl) return dataUrl;

      return dataUrl;
    } catch (error) {
      console.error("Image export failed:", error);
      throw new Error("Image export failed");
    }
  };

  const exportAsSVG = async (returnUrl = false) => {
    try {
      const canvasElement = document.querySelector(".react-flow__viewport");
      if (!canvasElement) {
        throw new Error("Canvas not found");
      }

      const { toSvg } = await import("html-to-image");

      const bounds = getNodesBounds();
      const width = bounds ? bounds.width : canvasElement.offsetWidth;
      const height = bounds ? bounds.height : canvasElement.offsetHeight;

      const options = {
        backgroundColor: exportSettings.includeBackground ? "#ffffff" : null,
        quality: exportSettings.quality,
        pixelRatio: exportSettings.scale,
        width: width,
        height: height,
        style: {
          width: width + "px",
          height: height + "px",
          transform: bounds ? `translate(${-bounds.x}px, ${-bounds.y}px)` : undefined
        }
      };

      const dataUrl = await toSvg(canvasElement, options);

      if (returnUrl) return dataUrl;

      return dataUrl;
    } catch (error) {
      console.error("SVG export failed:", error);
      throw new Error("SVG export failed");
    }
  };

  const exportAsPDF = async () => {
    try {
      const canvasElement = document.querySelector(".react-flow__viewport");
      if (!canvasElement) {
        throw new Error("Canvas not found");
      }

      const { toPng } = await import("html-to-image");
      const { jsPDF } = await import("jspdf");

      const bounds = getNodesBounds();
      const width = bounds ? bounds.width : canvasElement.offsetWidth;
      const height = bounds ? bounds.height : canvasElement.offsetHeight;

      const options = {
        backgroundColor: "#ffffff", // PDF usually needs white background
        quality: exportSettings.quality,
        pixelRatio: exportSettings.scale,
        width: width,
        height: height,
        style: {
          width: width + "px",
          height: height + "px",
          transform: bounds ? `translate(${-bounds.x}px, ${-bounds.y}px)` : undefined
        }
      };

      const dataUrl = await toPng(canvasElement, options);

      const pdf = new jsPDF({
        orientation: width > height ? "landscape" : "portrait",
        unit: "px",
        format: [width, height]
      });

      pdf.addImage(dataUrl, "PNG", 0, 0, width, height);
      pdf.save(`${currentProject.name}.pdf`);

      toast.success("Exported as PDF");
    } catch (error) {
      console.error("PDF export failed:", error);
      throw new Error("PDF export failed");
    }
  };

  const exportAsJSON = () => {
    const exportData = exportProject();
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    downloadFile(dataUri, `${currentProject.name}.json`);
    toast.success("Exported as JSON");
  };

  const exportAsMarkdown = () => {
    const markdown = generateMarkdownDoc();
    const dataUri =
      "data:text/markdown;charset=utf-8," + encodeURIComponent(markdown);
    downloadFile(dataUri, `${currentProject.name}.md`);
    toast.success("Exported as Markdown");
  };

  const exportAsMermaid = () => {
    const mermaidCode = generateMermaidDiagram();
    const dataUri =
      "data:text/plain;charset=utf-8," + encodeURIComponent(mermaidCode);
    downloadFile(dataUri, `${currentProject.name}.mmd`);
    toast.success("Exported as Mermaid");
  };

  const exportAsDrawIO = () => {
    try {
      const { nodes, edges } = currentProject;

      // Basic Draw.io XML structure
      const date = new Date().toISOString();
      let xml = `<mxfile host="app.diagrams.net" modified="${date}" agent="ArchyNex" version="21.0.0" type="device">
  <diagram id="archynex-diagram" name="Page-1">
    <mxGraphModel dx="1422" dy="762" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />`;

      // Add nodes
      nodes.forEach((node) => {
        const x = node.position?.x || 0;
        const y = node.position?.y || 0;
        const width = node.width || 150;
        const height = node.height || 80;
        const label = escapeXml(node.data?.label || "Node");

        // Basic style for nodes
        const style = "rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;";

        xml += `
        <mxCell id="${node.id}" value="${label}" style="${style}" vertex="1" parent="1">
          <mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry" />
        </mxCell>`;
      });

      // Add edges
      edges.forEach((edge) => {
        const sourceId = edge.source;
        const targetId = edge.target;

        // Basic style for edges
        const style = "edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;";

        xml += `
        <mxCell id="${edge.id}" value="" style="${style}" edge="1" parent="1" source="${sourceId}" target="${targetId}">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>`;
      });

      xml += `
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;

      const dataUri = "data:application/xml;charset=utf-8," + encodeURIComponent(xml);
      downloadFile(dataUri, `${currentProject.name}.drawio`);
      toast.success("Exported as Draw.io XML");
    } catch (error) {
      console.error("Draw.io export failed:", error);
      toast.error("Draw.io export failed");
    }
  };

  const downloadFile = (dataUri, filename) => {
    const link = document.createElement("a");
    link.href = dataUri;
    link.download = filename;
    link.click();
  };

  const generateMarkdownDoc = () => {
    const { nodes, edges } = currentProject;

    return `# ${currentProject.name}

${currentProject.description || "System Design Documentation"}

## Overview
This system design contains ${nodes.length} components and ${edges.length
      } connections.

## Components

${nodes
        .map(
          (node) => `### ${node.data.label}
- **Type**: ${node.data.category}
- **Description**: ${node.data.description}
- **Technology**: ${node.data.technology || "Not specified"}
- **Notes**: ${node.data.notes || "None"}
`
        )
        .join("\n")}

## Architecture Connections

${edges
        .map((edge, index) => {
          const sourceNode = nodes.find((n) => n.id === edge.source);
          const targetNode = nodes.find((n) => n.id === edge.target);
          return `${index + 1}. ${sourceNode?.data.label} → ${targetNode?.data.label
            }`;
        })
        .join("\n")}

---
*Generated by ArchyNex on ${new Date().toLocaleDateString()}*
`;
  };

  const generateMermaidDiagram = () => {
    const { nodes, edges } = currentProject;

    let mermaid = "graph TD\n";

    // Add nodes
    nodes.forEach((node) => {
      const id = node.id.replace(/[^a-zA-Z0-9]/g, "_");
      const label = (node.data.label || "Node").replace(/"/g, '\\"');
      mermaid += `    ${id}["${label}"]\n`;
    });

    // Add edges
    edges.forEach((edge) => {
      const sourceId = edge.source.replace(/[^a-zA-Z0-9]/g, "_");
      const targetId = edge.target.replace(/[^a-zA-Z0-9]/g, "_");
      mermaid += `    ${sourceId} --> ${targetId}\n`;
    });

    return mermaid;
  };

  const handleShare = async (option) => {
    if (!currentProject) {
      toast.error("No project to share");
      return;
    }

    console.log("Sharing project:", currentProject);
    const projectId = currentProject._id || currentProject.id;
    console.log("Project ID for share:", projectId);
    const shareUrl = `${window.location.origin}/shared/${projectId}`;
    const text = `Check out my system design: ${currentProject.name}`;
    const hashtags = "systemdesign,architecture,archynex";

    switch (option.id) {
      case "link":
        // Ensure project is saved or has an ID
        if (!currentProject._id && !currentProject.id) {
          toast.error("Please save the project first to generate a link.");
          return;
        }
        navigator.clipboard.writeText(shareUrl);
        toast.success("Shareable link copied to clipboard!");
        break;

      case "github":
        // Copy Markdown to clipboard and open Gist
        const markdown = generateMarkdownDoc();
        navigator.clipboard.writeText(markdown);
        window.open("https://gist.github.com/", "_blank");
        toast.success("Markdown copied! Paste it into a new Gist.");
        break;

      case "slack":
        // Copy a formatted summary for Slack
        const summary = `*${currentProject.name}*\n${currentProject.description || "No description"}\n\n*Components:* ${currentProject.nodes?.length}\n*Connections:* ${currentProject.edges?.length}\n\nView here: ${shareUrl}`;
        navigator.clipboard.writeText(summary);
        toast.success("Slack summary copied to clipboard!");
        break;

      case "email":
        const subject = `System Design: ${currentProject.name}`;
        const body = `Check out this system design:\n\n${currentProject.name}\n${currentProject.description || ""}\n\nView here: ${shareUrl}`;
        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
        break;

      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}&hashtags=${hashtags}`,
          "_blank"
        );
        break;

      case "linkedin":
        // LinkedIn sharing only takes a URL
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
        break;
    }
  };

  // Helper function to escape XML special characters
  const escapeXml = (text) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col border border-gray-200 dark:border-gray-700"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Export & Share
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Export your design in various formats or share with others
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FaTimes className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Export Formats */}
            <div className="flex-1 p-6 overflow-y-auto">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                Export Formats
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {exportFormats.map((format) => {
                  const Icon = format.icon;
                  return (
                    <button
                      key={format.id}
                      onClick={() => {
                        setSelectedFormat(format.id);
                        setPreviewUrl(null); // Reset preview when format changes
                      }}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${selectedFormat === format.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon
                          className={
                            selectedFormat === format.id
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-600 dark:text-gray-400"
                          }
                        />
                        <span className="font-medium text-gray-800 dark:text-white">
                          {format.name}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {format.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Export Settings */}
              {["png", "jpg", "svg"].includes(selectedFormat) && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                    <FaCog />
                    Export Settings
                  </h4>
                  <div className="space-y-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Include Background
                      </label>
                      <input
                        type="checkbox"
                        checked={exportSettings.includeBackground}
                        onChange={(e) =>
                          setExportSettings((prev) => ({
                            ...prev,
                            includeBackground: e.target.checked,
                          }))
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Quality
                      </label>
                      <select
                        value={exportSettings.quality}
                        onChange={(e) =>
                          setExportSettings((prev) => ({
                            ...prev,
                            quality: parseFloat(e.target.value),
                          }))
                        }
                        className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value={0.8}>Low (80%)</option>
                        <option value={1.0}>High (100%)</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Scale
                      </label>
                      <select
                        value={exportSettings.scale}
                        onChange={(e) =>
                          setExportSettings((prev) => ({
                            ...prev,
                            scale: parseInt(e.target.value),
                          }))
                        }
                        className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value={1}>1x</option>
                        <option value={2}>2x (Recommended)</option>
                        <option value={4}>4x (High DPI)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Preview Area */}
              {previewUrl && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                    <FaEye />
                    Preview
                  </h4>
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 flex justify-center overflow-hidden max-h-60">
                    <img src={previewUrl} alt="Preview" className="max-w-full h-auto object-contain" />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {["png", "jpg", "svg"].includes(selectedFormat) && (
                  <button
                    onClick={() => handleExport(true)}
                    disabled={isExporting || !currentProject}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaEye />
                    Preview
                  </button>
                )}

                <button
                  onClick={() => handleExport(false)}
                  disabled={isExporting || !currentProject}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isExporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <FaDownload />
                      Download {selectedFormat.toUpperCase()}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Share Options */}
            <div className="w-80 bg-gray-50 dark:bg-gray-800 p-6 border-l border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                Share Options
              </h3>
              <div className="space-y-2">
                {shareOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleShare(option)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                    >
                      <Icon className="text-gray-600 dark:text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white">
                          {option.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {option.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Project Info */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-800 dark:text-white mb-2">Project Info</h4>
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <strong>{currentProject?.name || "No Project"}</strong>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {currentProject?.nodes?.length || 0} components •{" "}
                    {currentProject?.edges?.length || 0} connections
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExportManager;
