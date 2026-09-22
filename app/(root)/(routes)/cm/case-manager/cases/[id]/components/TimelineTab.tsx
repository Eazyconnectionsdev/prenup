
"use client";

import { useEffect, useState } from "react";
import Axios from "@/lib/ApiConfig";
import { Card, CardContent } from "@/components/ui/card";

interface PerformedBy {
  _id?: string;
  email?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  suffix?: string | null;
}

interface TimelineItem {
  _id?: string;
  caseId?: string;
  action?: string;
  notes?: string;
  performedBy?: PerformedBy | string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface Props {
  caseData: any;
}

export default function TimelineTab({ caseData }: Props) {
  const caseId = caseData?._id;

  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTimeline = async () => {
    if (!caseId) return;

    try {
      setLoading(true);

      const { data } = await Axios.get(
        `/case-manager/${caseId}/timeline`
      );

      console.log("Timeline Response:", data);

      const records = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setTimeline(records);
    } catch (error) {
      console.error("Failed to load timeline", error);
      setTimeline([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!caseId) {
      setTimeline([]);
      setLoading(false);
      return;
    }

    loadTimeline();
  }, [caseId]);

  /**
   * Convert the performedBy value into something React
   * can safely render.
   */
  const getPerformedByName = (
    performedBy: TimelineItem["performedBy"]
  ): string => {
    if (!performedBy) {
      return "-";
    }

    // If backend returns an ID/string
    if (typeof performedBy === "string") {
      return performedBy;
    }

    // If backend returns populated user object
    const fullName = [
      performedBy.firstName,
      performedBy.middleName,
      performedBy.lastName,
      performedBy.suffix,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    if (fullName) {
      return fullName;
    }

    // Fallback to email
    if (performedBy.email) {
      return performedBy.email;
    }

    // Last safe fallback
    if (performedBy._id) {
      return performedBy._id;
    }

    return "-";
  };

  /**
   * Convert action codes such as:
   * RETURN_TO_DRAFT -> Return To Draft
   * CM_APPROVED -> CM Approved
   * LAWYERS_ASSIGNED -> Lawyers Assigned
   */
  const formatAction = (action?: string): string => {
    if (!action) {
      return "Timeline Event";
    }

    return action
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  /**
   * Format API timestamp safely.
   */
  const formatDate = (date?: string): string => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleString();
  };

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading timeline...
      </div>
    );
  }

  if (!caseId) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-sm text-muted-foreground">
            Case ID is missing.
          </p>
        </CardContent>
      </Card>
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
      {timeline.map((item, index) => {
        const performedByName = getPerformedByName(
          item.performedBy
        );

        return (
          <Card
            key={item._id || index}
            className="relative overflow-hidden"
          >
            <CardContent className="p-4">
              {/* Action */}
              <div className="font-semibold text-base">
                {formatAction(item.action)}
              </div>

              {/* Notes */}
              {item.notes && (
                <div className="text-sm text-slate-600 mt-2">
                  {item.notes}
                </div>
              )}

              {/* Date */}
              <div className="text-sm text-slate-500 mt-3">
                {formatDate(item.createdAt)}
              </div>

              {/* Performed By */}
              <div className="text-xs text-slate-400 mt-1">
                By: {performedByName}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

