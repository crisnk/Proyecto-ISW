import { useEffect, useState, useCallback } from "react";
import { getAllHorarios } from "../services/horario.service";

export default function usePaginatedTable(initialPage = 1, initialLimit = 6, initialFilters = {}) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState(initialFilters);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("Fetch Data Params:", { page, limit, filters }); 

      const response = await getAllHorarios(page, limit, filters);
      console.log("Datos recibidos:", response);

      setData(response.data);
      setTotalPages(response.pages);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, page, totalPages, isLoading, setPage, setFilters, setLimit };
}
