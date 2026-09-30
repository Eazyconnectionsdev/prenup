"use client";

import { useEffect, useState } from "react";
import Axios from "@/lib/ApiConfig";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  caseData: any;
}

export default function TimelineTab({
  caseData,
}: Props) {
  const caseId = caseData?._id;

  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] =
    useState(true);

  const loadTimeline = async () => {
    try {
      const { data } = await Axios.get(
        `/case-manager/${caseId}/timeline`
      );

      console.log(
        "Timeline Response:",
        data
      );

      setTimeline(
        Array.isArray(data)
          ? data
          : data?.items || []
      );
    } catch (error) {
      console.error(
        "Failed to load timeline",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!caseId) return;

    loadTimeline();
  }, [caseId]);

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading timeline...
      </div>
    );
  }

  if (!timeline.length) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-sm text-muted-foreground">
            No timeline records found.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {timeline.map(
        (item: any, index: number) => (
          <div
            key={
              item.id ||
              item._id ||
              index
            }
            className="relative border rounded-xl p-4"
          >
            <div className="font-semibold">
              {item.title ||
                item.event ||
                item.action ||
                "Timeline Event"}
            </div>

            {item.description && (
              <div className="text-sm text-slate-600 mt-1">
                {item.description}
              </div>
            )}

            <div className="text-sm text-slate-500 mt-2">
              {item.createdAt ||
              item.date ||
              item.timestamp
                ? new Date(
                    item.createdAt ||
                      item.date ||
                      item.timestamp
                  ).toLocaleString()
                : "-"}
            </div>

            {item.performedBy && (
              <div className="text-xs text-slate-400 mt-1">
                By:{" "}
                {item.performedBy
                  ?.name ||
                  item.performedBy
                    ?.fullName ||
                  item.performedBy}
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}