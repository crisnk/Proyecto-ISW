import { useEffect, useState } from "react";
import { getAllHorarios } from "../services/horario.service"; 

export default function usePaginatedTable(initialPage = 1, initialLimit = 6) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getAllHorarios(page, limit, filters); 
        setData(response.data);
        setTotalPages(response.pages);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [page, limit, filters]);
  
  

  return { data, page, totalPages, isLoading, setPage, setFilters };
}
