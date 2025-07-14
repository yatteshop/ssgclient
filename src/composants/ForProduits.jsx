import React from 'react';
import Menu from "./Menu";
import Produit from "./Produit";
import { useState, useEffect } from "react";
import { useSearchStore, useCategoryStore } from "@/stores/Store";
import { useModal } from "@/contextes/ModalContext";
import Modal from "@/composants/Modal";

const normalizeText = (text) => {
  if (!text) return "";
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
};

export default function ForProduits({ categories = [], produits = [] }) {
  const { showModal } = useModal();
  const { searchQuery = "" } = useSearchStore(); // 🛡️ fallback vide
  const { selectedCategory = null } = useCategoryStore(); // 🛡️ fallback null

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(12);

  useEffect(() => {
    if (produits?.length) {
      setTotalPages(Math.ceil(produits.length / pageSize));
    }
  }, [produits, pageSize]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const produitsAvecCategorie = produits.map((item) => {
    const categoryInfo = categories.find((c) => c.id === item.category);
    return {
      ...item,
      categoryName: categoryInfo ? categoryInfo.name : "",
    };
  });

  const normalizedSearch = normalizeText(searchQuery);
  const searchTerms = normalizedSearch.split(" ").filter(Boolean);

  const filteredData = produitsAvecCategorie
    .filter((item) => {
      const matchesCategory =
        !selectedCategory || item.category === selectedCategory.id;

      const nameMatch = searchTerms.every((term) =>
        normalizeText(item.name).includes(term)
      );
      const categoryMatch = searchTerms.every((term) =>
        normalizeText(item.categoryName).includes(term)
      );
      const descriptionMatch = searchTerms.every((term) =>
        normalizeText(item.description || "").includes(term)
      );

      return matchesCategory && (nameMatch || categoryMatch || descriptionMatch);
    })
    .reverse();

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="Produits">
      <Menu categories={categories} />
      {showModal && <Modal />}
      <div className="Donnees">
        {currentData.map((item) => (
          <Produit key={item.id} {...item} item={item} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="containerPagination">
          <ul className="pagination">
            {currentPage > 1 && (
              <li className="page-item">
                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                  &laquo;
                </button>
              </li>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 2 && page <= currentPage + 2)
              )
              .map((page, i, arr) => {
                const prevPage = arr[i - 1];
                const isEllipsis = prevPage && page - prevPage > 1;

                return (
                  <React.Fragment key={page}>
                    {isEllipsis && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}
                    <li className={`page-item ${currentPage === page ? "active" : ""}`}>
                      <button className="page-link" onClick={() => handlePageChange(page)}>
                        {page}
                      </button>
                    </li>
                  </React.Fragment>
                );
              })}

            {currentPage < totalPages && (
              <li className="page-item">
                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                  &raquo;
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
