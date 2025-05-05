import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import DiagnosisDetailComponent from "@/components/diagnosis/DiagnosisDetailComponent";
import { getDiagnosisById, DiagnosisResult } from "@/services/diagnosisService";
import { toast } from "sonner";

const DiagnosisDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        if (!id) return;
        const data = await getDiagnosisById(id);
        setDiagnosis(data);
      } catch (error) {
        console.error("Error fetching diagnosis:", error);
        toast.error("Failed to load diagnosis details");
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnosis();
  }, [id]);

  return (
    <Layout title="Diagnosis Details">
      <DiagnosisDetailComponent diagnosis={diagnosis} />
    </Layout>
  );
};

export default DiagnosisDetail;