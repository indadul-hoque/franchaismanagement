import React, { useState, useEffect } from "react";
import {
  MdDelete,
  MdAdd,
  MdCategory,
  MdAttachMoney,
  MdLayers,
  MdEdit,
} from "react-icons/md";
import {
  FaBoxes,
  FaCloudUploadAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

import { currentConfig } from "../../../../../utils";

const API_URL = currentConfig.API_URL;

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    stock: "",
    images: [],
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/products/getAllProducts`);
        setProducts(response.data.products || []);
      } catch (error) {
        setError("Failed to stream accurate inventories.");
        console.error("Fetch Products Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleEdit = async (productId) => {
    console.log("Edit Product:", productId);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axios.delete(`${API_URL}/products/deleteProduct/${productId}`);
      const updatedProducts = products.filter(
        (product) => product._id !== productId,
      );
      setProducts(updatedProducts);
      toast.success("Product scrubbed successfully!");

      if (updatedProducts.length <= (currentPage - 1) * productsPerPage) {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
      }
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to eliminate product record.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setSelectedImages(e.target.files);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("category", newProduct.category);
    formData.append("stock", newProduct.stock);

    Array.from(selectedImages).forEach((file) => {
      formData.append("image", file);
    });

    try {
      const response = await axios.post(
        `${API_URL}/products/createProduct`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      setProducts([...products, response.data.product]);
      toast.success("Catalog entry added successfully!");
      setShowModal(false);
      setNewProduct({
        name: "",
        category: "",
        price: "",
        description: "",
        stock: "",
        images: [],
      });
      setSelectedImages([]);
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Process aborted. Validation failed.");
    } finally {
      setUploading(false);
    }
  };

  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  return (
    <div
      className="container-fluid py-4 px-4"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      {/* Top Banner & Action */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
            <FaBoxes className="text-primary opacity-90" size={26} /> Product
            Inventory
          </h2>
          <p className="text-muted mb-0 small">
            Monitor your global catalog holdings, asset values, and listing
            properties.
          </p>
        </div>
        <button
          className="btn btn-primary btn-lg fw-bold px-4 shadow-sm d-flex align-items-center justify-content-center gap-2"
          onClick={() => setShowModal(true)}
          style={{ borderRadius: "10px", fontSize: "0.95rem" }}
        >
          <MdAdd size={20} /> Upload Product
        </button>
      </div>

      {error && (
        <div className="alert alert-danger border-0 shadow-sm rounded-3 mb-4">
          {error}
        </div>
      )}

      {/* Main Framework Content Grid */}
      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
        <div className="card-body p-0">
          {loading ? (
            <div className="d-flex flex-column justify-content-center align-items-center py-5 my-5">
              <div
                className="spinner-border text-primary mb-3"
                style={{ width: "3rem", height: "3rem" }}
                role="status"
              />
              <span className="text-muted fw-semibold">
                Extracting live ledger matrix...
              </span>
            </div>
          ) : currentProducts.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr className="bg-light border-bottom">
                    <th
                      className="py-3 px-4 text-uppercase tracking-wider text-secondary fw-bold small"
                      style={{ width: "35%" }}
                    >
                      Product Meta
                    </th>
                    <th
                      className="py-3 text-uppercase tracking-wider text-secondary fw-bold small"
                      style={{ width: "20%" }}
                    >
                      Category Matrix
                    </th>
                    <th
                      className="py-3 text-uppercase tracking-wider text-secondary fw-bold small"
                      style={{ width: "15%" }}
                    >
                      Valuation
                    </th>
                    <th
                      className="py-3 text-uppercase tracking-wider text-secondary fw-bold small"
                      style={{ width: "20%" }}
                    >
                      Asset Previews
                    </th>
                    <th
                      className="py-3 px-4 text-end text-uppercase tracking-wider text-secondary fw-bold small"
                      style={{ width: "10%" }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((product) => (
                    <tr key={product._id} className="border-bottom">
                      {/* Name & Desc Info block */}
                      <td className="py-3 px-4">
                        <div className="fw-bold text-dark mb-0.5">
                          {product.name}
                        </div>
                        <div
                          className="text-muted small text-truncate"
                          style={{ maxWidth: "260px" }}
                        >
                          {product.description || "No description logged."}
                        </div>
                      </td>

                      {/* Styled Category tags */}
                      <td className="py-3">
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1.5 rounded-pill fw-semibold text-capitalize">
                          {product.category}
                        </span>
                      </td>

                      {/* Price matrix formatting */}
                      <td
                        className="py-3 fw-bold text-dark"
                        style={{ letterSpacing: "-0.5px" }}
                      >
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </td>

                      {/* Polished Asset galleries stack */}
                      <td className="py-3">
                        <div className="d-flex align-items-center gap-1.5 overflow-hidden">
                          {product.image && product.image.length > 0 ? (
                            product.image.map((img, index) => (
                              <div
                                key={index}
                                className="border rounded-3 p-0.5 bg-white shadow-sm flex-shrink-0"
                                style={{ width: "42px", height: "42px" }}
                              >
                                <img
                                  src={img.url}
                                  alt={product.name}
                                  className="w-100 h-100 object-fit-cover rounded-2"
                                />
                              </div>
                            ))
                          ) : (
                            <span className="text-muted small italic opacity-60">
                              No Media
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Unified Quick Actions row */}
                      <td className="py-3 px-4 text-end d-flex">
                        {/* Edit Button */}
                        <button
                          className="btn btn-sm btn-light border p-2 rounded-3 text-primary hover-shadow transition-all me-2"
                          title="Edit asset details"
                          onClick={() => handleEdit(product._id)}
                        >
                          <MdEdit size={18} />
                        </button>

                        {/* Delete Button */}
                        <button
                          className="btn btn-sm btn-light border p-2 rounded-3 text-danger hover-shadow transition-all"
                          title="Purge asset from catalog"
                          onClick={() => handleDelete(product._id)}
                        >
                          <MdDelete size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Data Pagination Footers */}
              {totalPages > 1 && (
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center px-4 py-3 bg-white border-top gap-3">
                  <div className="text-muted small fw-medium">
                    Showing{" "}
                    <span className="text-dark fw-semibold">
                      {indexOfFirstProduct + 1}
                    </span>{" "}
                    to{" "}
                    <span className="text-dark fw-semibold">
                      {Math.min(indexOfLastProduct, products.length)}
                    </span>{" "}
                    of{" "}
                    <span className="text-dark fw-semibold">
                      {products.length}
                    </span>{" "}
                    items
                  </div>
                  <nav>
                    <ul className="pagination pagination-sm mb-0 gap-1">
                      <li
                        className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link rounded border d-flex align-items-center px-2.5 py-1.5"
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                        >
                          <FaChevronLeft size={10} />
                        </button>
                      </li>
                      {[...Array(totalPages).keys()].map((number) => (
                        <li
                          key={number}
                          className={`page-item ${currentPage === number + 1 ? "active" : ""}`}
                        >
                          <button
                            onClick={() => setCurrentPage(number + 1)}
                            className="page-link rounded fw-bold border px-3 py-1.5 mx-0.5"
                          >
                            {number + 1}
                          </button>
                        </li>
                      ))}
                      <li
                        className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link rounded border d-flex align-items-center px-2.5 py-1.5"
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages),
                            )
                          }
                        >
                          <FaChevronRight size={10} />
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-5 my-5">
              <div className="text-muted opacity-40 mb-3">
                <FaBoxes size={54} />
              </div>
              <h5 className="fw-bold text-secondary">Empty Product Ledger</h5>
              <p className="text-muted small max-w-xs mx-auto mb-4">
                You have not registered any warehouse catalog items into
                database records yet.
              </p>
              <Button
                variant="outline-primary"
                className="fw-bold"
                onClick={() => setShowModal(true)}
              >
                Upload First Product
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modernized Upload Product Backdrop Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        backdrop="static"
        contentClassName="border-0 shadow-lg"
        dialogClassName="modal-md"
      >
        <Modal.Header closeButton className="border-bottom-0 pt-4 px-4 pb-2">
          <Modal.Title className="fw-bold text-dark d-flex align-items-center gap-2">
            <FaCloudUploadAlt className="text-primary" /> Manifest New Entry
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 py-2">
          <Form onSubmit={handleUpload}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold text-secondary small mb-1">
                Product Identity Name
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                className="border-2"
                style={{ fontSize: "0.95rem" }}
                placeholder="e.g., Premium Leather Jacket"
                value={newProduct.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold text-secondary small mb-1">
                    <span className="d-flex align-items-center gap-1">
                      <MdCategory /> Category
                    </span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    className="border-2"
                    style={{ fontSize: "0.95rem" }}
                    placeholder="e.g., Apparel"
                    value={newProduct.category}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold text-secondary small mb-1">
                    <span className="d-flex align-items-center gap-1">
                      <MdAttachMoney /> Base Price (INR)
                    </span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    className="border-2"
                    style={{ fontSize: "0.95rem" }}
                    placeholder="₹ Structure"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold text-secondary small mb-1">
                    <span className="d-flex align-items-center gap-1">
                      <MdLayers /> Initial Stock
                    </span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    className="border-2"
                    style={{ fontSize: "0.95rem" }}
                    placeholder="Quantity"
                    value={newProduct.stock}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold text-secondary small mb-1">
                    Image Media Assets
                  </Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    className="border-2"
                    style={{ fontSize: "0.85rem" }}
                    onChange={handleImageChange}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold text-secondary small mb-1">
                Description Brief
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                className="border-2"
                style={{ fontSize: "0.95rem" }}
                placeholder="Write clear, descriptive product features..."
                value={newProduct.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 border-top-0 pt-2 pb-3">
              <Button
                variant="light"
                type="button"
                className="border px-4 fw-semibold"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="px-4 fw-bold shadow-sm"
                disabled={uploading}
              >
                {uploading ? (
                  <span className="d-flex align-items-center gap-2">
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                    />{" "}
                    Processing...
                  </span>
                ) : (
                  "Commit Upload"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
