import { use } from "react";
import { Stack, Typography } from "@mui/material";
import { notFound } from "next/navigation";
import {
  privacyPolicy,
  termsOfService,
  refundPolicy,
  shippingPolicy,
} from "@/assets/policies";

interface PolicyData {
  title: string;
  lastUpdated: string;
  sections: Array<{
    heading: string;
    content: string;
  }>;
}

// Centralized policy map – scalable and clean
const policyMap: Record<string, PolicyData> = {
  "privacy-policy": privacyPolicy,
  "terms-of-service": termsOfService,
  "refund-policy": refundPolicy,
  "shipping-policy": shippingPolicy,
};

interface PolicyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const LegalPolicyPage = ({ params }: PolicyPageProps) => {
  const { slug } = use(params);
  const policyData = policyMap[slug];

  // If policy doesn't exist, show 404
  if (!policyData) {
    notFound();
  }

  return (
    <Stack
      bgcolor="background.default"
      pt={{ xs: 14, md: 20 }}
      pb={{ xs: 0, md: 4 }}
      spacing={2}
      justifyContent="center"
      alignItems="center"
    >
      <Typography
        component="h1"
        sx={{
          fontFamily: "Bricolage",
          color: "primary.main",
          fontWeight: 700,
          marginBottom: "1rem",
          textAlign: "center",
          fontSize: { xs: "6vw", md: "3vw" },
        }}
      >
        {policyData.title}
      </Typography>
      <Stack>
        {policyData.sections.map(
          (section: PolicyData["sections"][0], index: number) => (
            <Stack key={index} mb={4} maxWidth="1600px" px={2}>
              <Typography
                sx={{
                  fontFamily: "Bricolage",
                  fontWeight: 700,
                  fontSize: { xs: "4vw", md: "1.4vw" },
                  color: "primary.main",
                  marginBottom: "0.5rem",
                }}
              >
                {section.heading}
              </Typography>
              <Typography
                component="div"
                sx={{
                  textAlign: "justify",
                  lineHeight: "1.3",
                  fontFamily: "Bricolage",
                  fontSize: { xs: "3vw", md: "1vw" },
                  color: "secondary.main",
                  "& table": {
                    width: "100%",
                    border: `4px solid #F6A09E`,
                    borderRadius: "8px",
                    borderCollapse: "collapse",
                    tableLayout: "fixed",
                    "& th, & td": {
                      width: "50%",
                      border: `1px solid #F6A09E`,
                      padding: "0.5rem",
                    },
                    "& th": {
                      color: "background.default",
                      backgroundColor: "secondary.main",
                      textAlign: "center",
                    },
                  },
                  "& strong": {
                    color: "primary.main",
                    fontWeight: 600,
                  },
                  "& ul": {
                    listStyleType: "disc",
                    paddingLeft: "3rem",
                    marginBottom: "1rem",
                  },
                  "& a": {
                    color: "primary.main",
                    textDecoration: "underline",
                    transition: "color 0.3s ease",
                    "&:hover": {
                      color: "secondary.main",
                    },
                  },
                }}
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </Stack>
          )
        )}
      </Stack>
    </Stack>
  );
};

export default LegalPolicyPage;
