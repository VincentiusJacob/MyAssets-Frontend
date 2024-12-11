import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Authenticated() {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlData = urlParams.get("data");

    if (urlData) {
      try {
        const decodedData = decodeURIComponent(urlData);
        const parsedData = JSON.parse(decodedData);
        console.log("Parsed data: ", parsedData);

        localStorage.setItem("data", JSON.stringify(parsedData));
        setData(decodedData);
      } catch (err) {
        console.error("Error parsing data:", err);
        setData(null);
      }
    } else {
      console.log("Data does not exist");
      setData(null);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (data) {
        navigate("/Dashboard", { replace: true });
      } else {
        navigate("/register", { replace: true });
      }
    }
  }, [loading, data, navigate]);

  return <div>{loading ? <p>Loading...</p> : <p>Redirecting...</p>}</div>;
}

export default Authenticated;
