import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { faqData } from "@/assets/faqData";

const FAQPage = () => {
  return (
    <Box
      sx={{
        backgroundColor: "secondary.main",
        minHeight: "100vh",
        py: { xs: 20, md: 20 },
        px: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        component="img"
        src="/images/neko/faq.png"
        alt="Neko FAQ"
        width={{ xs: 150, sm: 200, md: 250 }}
        mb={4}
      />

      {faqData.map((topic, index) => (
        <Accordion
          key={index}
          sx={{
            maxWidth: 1200,
            width: "100%",
            backgroundColor: "background.default",
            borderRadius: 2,
            boxShadow: `4px 4px 0 #F6A09E`,
            mb: 2,
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
          >
            <Typography
              fontSize={{ xs: "4vw", md: "1.6vw" }}
              fontWeight={800}
              color={"primary.main"}
            >
              {topic.topic}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {topic.type === "faq" ? (
              topic.content?.map((item, idx) => (
                <Accordion
                  key={idx}
                  sx={{
                    backgroundColor: "background.default",
                    mb: 1,
                    border: `3px solid #B5D782`,
                    borderRadius: 2,
                    boxShadow: `2px 2px 0 #B5D782`,
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon sx={{ color: "secondary.main" }} />
                    }
                  >
                    <Typography
                      fontSize={{ xs: "3.5vw", md: "1.4vw" }}
                      sx={{ color: "primary.main", fontWeight: 500 }}
                    >
                      {item.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography
                      component="div"
                      fontSize={{ xs: "3vw", md: "1.2vw" }}
                      sx={{
                        color: "secondary.main",
                        mt: -2,
                        "& ul": {
                          paddingLeft: { xs: "5vw", md: "2vw" },
                          mt: -2,
                          listStyleType: "disc",
                        },
                        "& .pinky": {
                          color: "primary.main",
                        },
                      }}
                    >
                      {item.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Typography
                component="div"
                sx={{
                  color: "secondary.main",
                  fontSize: { xs: "3vw", md: "1.2vw" },
                  "& .pinky": {
                    color: "primary.main",
                  },
                  "& ul": {
                    paddingLeft: { xs: "5vw", md: "2vw" },
                    mt: -2,
                    listStyleType: "disc",
                  },
                }}
              >
                {topic.answer}
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default FAQPage;
