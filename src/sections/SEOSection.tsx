"use client";
import { Box, Typography, Button, Collapse } from "@mui/material";
import { useState } from "react";
import Link from "next/link";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const SEOSection = () => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <Box px={{ xs: 1, md: 4 }} py={2}>
      <Typography
        variant="h4"
        mt={2}
        fontSize={{ xs: 12, md: 24, lg: "1.4vw" }}
        fontFamily="Bricolage Bold"
        fontWeight={800}
      >
        Discover Umi Matcha: India&apos;s Premier Destination for Authentic
        Japanese Organic Matcha Powder
      </Typography>
      <Typography
        variant="body1"
        mt={2}
        fontSize={{ xs: 12, md: 16, lg: "1vw" }}
        textAlign="justify"
      >
        Welcome to Umi Matcha, recognized as the best matcha brand India has to
        offer. Our commitment to delivering the best organic matcha directly
        from Japan&apos;s renowned tea gardens has made us the trusted choice
        for matcha enthusiasts across the country. As India&apos;s leading
        source for premium organic matcha powder, we bring you centuries-old
        Japanese tradition in every vibrant green sip.
      </Typography>

      <Collapse in={expanded} timeout={600} unmountOnExit>
        <Typography
          variant="h4"
          mt={{ xs: 3, md: 6 }}
          fontSize={{ xs: 12, md: 24, lg: "1.4vw" }}
          fontFamily="Bricolage Bold"
          fontWeight={800}
        >
          Why Umi Matcha Represents the Best Matcha in India
        </Typography>
        <Typography
          variant="body1"
          mt={1}
          fontSize={{ xs: 12, md: 16, lg: "1vw" }}
          textAlign="justify"
        >
          At Umi Matcha, we understand that discerning customers seek nothing
          less than excellence. That&apos;s why we&apos;ve established ourselves
          as the best matcha in India by sourcing only the finest ceremonial and
          premium grade matcha directly from Japan&apos;s most prestigious tea
          regions. Our commitment to quality has positioned us as the best
          matcha brand India can trust for authentic, pure, and potent matcha
          experiences.
          <br />
          <br />
          Our carefully curated selection represents the pinnacle of Japanese
          tea craftsmanship. Every package of Umi Matcha undergoes rigorous
          quality control to ensure you receive the best organic matcha
          available in the Indian market. We believe that true matcha
          connoisseurs deserve access to the same quality enjoyed in traditional
          Japanese tea ceremonies, which is why Umi Matcha has become synonymous
          with authenticity and excellence.
        </Typography>
        <Typography
          variant="h4"
          mt={{ xs: 3, md: 6 }}
          fontSize={{ xs: 12, md: 24, lg: "1.4vw" }}
          fontFamily="Bricolage Bold"
          fontWeight={800}
        >
          Why Choose Umi Matcha as the Best Matcha Brand India
        </Typography>
        <Typography
          variant="body1"
          mt={1}
          fontSize={{ xs: 12, md: 16, lg: "1vw" }}
          textAlign="justify"
        >
          What sets Umi Matcha apart as the best matcha brand India offers is
          our unwavering commitment to authenticity and quality assurance.
          Unlike other suppliers, we maintain direct partnerships with certified
          organic tea gardens in Japan&apos;s most prestigious regions, ensuring
          every batch of our organic matcha powder meets the highest
          international standards.
          <br />
          <br />
          Our quality promise encompasses multiple layers of excellence. First,
          we source exclusively from first-harvest tea leaves, guaranteeing the
          best japanese matcha with optimal flavor profiles and nutritional
          density. Second, our best organic matcha undergoes traditional
          stone-grinding processes that preserve the delicate cellular structure
          and natural properties that define premium matcha powder.
          <br />
          <br />
          Customer trust is paramount to our success as the best matcha in
          India. We provide complete transparency in our sourcing, with
          information like harvest and cultivar information, regions and
          processing methods for every product. Our customer satisfaction
          guarantee ensures that when you choose Umi Matcha, you&apos;re
          investing in a brand that stands behind its quality claims.
          <br />
          <br />
          Additionally, our expertise in matcha extends beyond just selling
          products. As the recognized best matcha tea brand in India, we provide
          comprehensive education about proper preparation techniques, storage
          methods, and optimal consumption practices. This commitment to
          customer education has earned us loyalty from tea enthusiasts,
          wellness professionals, and culinary experts throughout India.
        </Typography>
        <Typography
          variant="h4"
          mt={{ xs: 3, md: 6 }}
          fontSize={{ xs: 12, md: 24, lg: "1.4vw" }}
          fontFamily="Bricolage Bold"
          fontWeight={800}
        >
          Umi Matcha Product Collection: From Ceremonial Excellence to Daily
          Wellness
        </Typography>
        <Typography
          variant="h5"
          mt={{ xs: 3, md: 3 }}
          mb={{ xs: -1, md: 0 }}
          fontSize={{ xs: "3.6vw", md: 24, lg: "1.1vw" }}
          fontWeight={800}
        >
          Premium Matcha Selections
        </Typography>
        <Typography
          variant="body1"
          mt={2}
          fontSize={{ xs: 12, md: 16, lg: "1vw" }}
          textAlign="justify"
        >
          <Link
            href="/shop/nakai-first-harvest"
            style={{ color: "#fd918fff", fontWeight: 800 }}
          >
            Nakai First Harvest
          </Link>
          <br />
          Our flagship Nakai First Harvest represents the epitome of ceremonial
          grade excellence. Harvested from the youngest tea leaves during the
          first spring picking, this best japanese matcha powder delivers an
          unparalleled taste experience with natural sweetness and minimal
          bitterness.
        </Typography>
        <Typography
          variant="body1"
          mt={1}
          fontSize={{ xs: 12, md: 16, lg: "1vw" }}
          textAlign="justify"
        >
          <Link
            href="/shop/haru-first-harvest"
            style={{ color: "#fd918fff", fontWeight: 800 }}
          >
            Haru First Harvest
          </Link>
          <br />
          The Haru First Harvest offers another exceptional option for those
          seeking authentic, best Japanese matcha quality. Perfect for
          traditional whisking and meditation, this grade showcases the pure
          essence of Japanese tea mastery
        </Typography>
        <Typography
          variant="body1"
          mt={1}
          fontSize={{ xs: 12, md: 16, lg: "1vw" }}
          textAlign="justify"
        >
          <Link
            href="/shop/mixcha-instant-premix"
            style={{ color: "#fd918fff", fontWeight: 800 }}
          >
            Mixcha: Instant Premix
          </Link>
          <br />
          For modern convenience without compromising quality, our Mixcha:
          Instant Premix provides an innovative solution for busy lifestyles
          while maintaining the nutritional integrity that makes us the best
          matcha tea brand in India.
        </Typography>
        <Typography
          variant="h5"
          mt={{ xs: 3, md: 3 }}
          mb={{ xs: 2, md: 0 }}
          fontSize={{ xs: "3.6vw", md: 24, lg: "1.1vw" }}
          fontWeight={800}
        >
          Traditional Tea Ceremony Essentials
        </Typography>
        <Typography
          variant="body1"
          mt={-2}
          fontSize={{ xs: 12, md: 16, lg: "1vw" }}
          textAlign="justify"
        >
          <br />
          Understanding that authentic matcha preparation requires proper tools,
          we offer a complete range of traditional Japanese implements.&nbsp;
          <Link
            href="/shop/bowl-chawan"
            style={{ color: "#fd918fff", fontWeight: 800 }}
          >
            Our Matcha Bowl (Chawan)&nbsp;
          </Link>
          provides the perfect vessel for whisking, while the&nbsp;
          <Link
            href="/shop/whisk-chasen"
            style={{ color: "#fd918fff", fontWeight: 800 }}
          >
            Matcha Whisk (Chasen)&nbsp;
          </Link>
          &nbsp; ensures proper froth formation essential for ceremonial
          preparation.&nbsp;
          <br />
          <br />
          The&nbsp;
          <Link
            href="/shop/scoop-chashaku"
            style={{ color: "#fd918fff", fontWeight: 800 }}
          >
            Matcha Scoop (Chashaku)&nbsp;
          </Link>
          &nbsp; allows for precise measurement, and our&nbsp;
          <Link
            href="/shop/whisk-holder-kusenaoshi"
            style={{ color: "#fd918fff", fontWeight: 800 }}
          >
            Whisk Holder (Kusenaoshi)&nbsp;
          </Link>
          &nbsp; helps maintain your whisk&apos;s shape between uses. For those
          seeking convenience, our&nbsp;
          <Link
            href="/shop/umi-matcha-essential-kit"
            style={{ color: "#fd918fff", fontWeight: 800 }}
          >
            Umi Matcha Essentials Kit&nbsp;
          </Link>
          &nbsp; combines all necessary tools in one comprehensive package.
        </Typography>
        <Typography
          variant="h5"
          mt={{ xs: 4, md: 3 }}
          fontSize={{ xs: "3.6vw", md: 24, lg: "1.1vw" }}
          fontWeight={800}
        >
          Curated Gift Sets
        </Typography>
        <Typography
          variant="body1"
          mt={1}
          fontSize={{ xs: 12, md: 16, lg: "1vw" }}
          textAlign="justify"
        >
          Our thoughtfully designed gift collections make sharing the Umi Matcha
          experience effortless. The&nbsp;
          <Link
            href="/shop/sereni-tea-set"
            style={{ color: "#fd918fff", fontWeight: 800 }}
          >
            Sereni Tea Set
          </Link>
          &nbsp; offers an elegant introduction to matcha culture, while
          the&nbsp;
          <Link
            href="/shop/whisk-me-away-set"
            style={{ color: "#fd918fff", fontWeight: 800 }}
          >
            Whisk Me Away Set
          </Link>
          &nbsp; provides everything needed for authentic preparation.
          <br />
          <br />
          The{" "}
          <Link
            href="/shop/scoop-me-up-set"
            style={{ color: "#fd918fff", fontWeight: 800 }}
          >
            Scoop Me Up Set
          </Link>{" "}
          represents exceptional value for newcomers to matcha, combining
          essential tools with premium powder to create the perfect starting
          point for your matcha journey.
        </Typography>
        <Typography
          variant="h4"
          mt={{ xs: 3, md: 6 }}
          fontSize={{ xs: 12, md: 24, lg: "1.4vw" }}
          fontFamily="Bricolage Bold"
          fontWeight={800}
        >
          The Umi Matcha Difference: Quality, Authenticity, and Trust
        </Typography>
        <Typography
          variant="body1"
          mt={1}
          fontSize={{ xs: 12, md: 16, lg: "1vw" }}
          textAlign="justify"
        >
          What distinguishes Umi Matcha as the best organic matcha provider in
          India is our unwavering commitment to authenticity. Unlike many brands
          that compromise on quality or origin, we maintain direct relationships
          with Japanese tea gardens, ensuring every batch meets the strictest
          quality standards.
          <br />
          <br />
          Our matcha powder exhibits the hallmarks of superior quality: vibrant
          jade-green color indicating high chlorophyll content, ultra-fine
          particle size for smooth mixing, and the characteristic sweet, vegetal
          aroma that defines premium grades. When whisked, our matcha creates a
          rich, creamy froth within seconds, demonstrating the careful
          processing that preserves the tea&apos;s natural properties.
        </Typography>
        <Typography
          variant="h4"
          mt={{ xs: 3, md: 6 }}
          fontSize={{ xs: 12, md: 24, lg: "1.4vw" }}
          fontFamily="Bricolage Bold"
          fontWeight={800}
        >
          Health and Wellness: The Umi Matcha Advantage
        </Typography>
        <Typography
          variant="body1"
          mt={1}
          fontSize={{ xs: 12, md: 16, lg: "1vw" }}
          textAlign="justify"
        >
          The wellness benefits of our premium matcha extend far beyond
          traditional matcha tea enjoyment. Research indicates that regular
          consumption of high-quality matcha may support weight management,
          enhance mental clarity, and provide sustained energy without the
          jitters associated with coffee. The unique combination of caffeine and
          L-theanine creates a state of calm alertness that has made matcha the
          preferred beverage of Zen monks for centuries.
          <br />
          <br />
          Our organic matcha powder contains no artificial additives,
          pesticides, or preservatives, ensuring you receive pure, concentrated
          nutrition in every serving. The ORAC (Oxygen Radical Absorption
          Capacity) rating of premium matcha exceeds that of blueberries,
          pomegranates, and other renowned superfoods by significant margins
        </Typography>
        <Typography
          variant="h4"
          mt={{ xs: 3, md: 6 }}
          fontSize={{ xs: 12, md: 24, lg: "1.4vw" }}
          fontFamily="Bricolage Bold"
          fontWeight={800}
        >
          Experience Authentic Japanese Tradition with Umi Matcha
        </Typography>
        <Typography
          variant="body1"
          mt={1}
          fontSize={{ xs: 12, md: 16, lg: "1vw" }}
          textAlign="justify"
        >
          At Umi Matcha, we believe that exceptional matcha should be accessible
          to everyone seeking genuine quality and authentic flavor. Our
          commitment to being the best matcha brand India offers extends beyond
          product excellence to include education, customer support, and
          community building around this ancient wellness tradition.
          <br />
          <br />
          Whether you&apos;re beginning your matcha journey or seeking to
          elevate your existing practice, Umi Matcha provides the foundation for
          transformative wellness experiences. Explore our complete collection
          at our{" "}
          <Link href="/shop" style={{ color: "#fd918fff", fontWeight: 800 }}>
            shop
          </Link>{" "}
          and discover why discerning customers throughout India choose Umi
          Matcha for their daily wellness rituals.
          <br />
          <br />
          Join thousands of satisfied customers who have made Umi Matcha their
          trusted source for premium Japanese matcha. Experience the difference
          that authentic quality, traditional processing, and unwavering
          commitment to excellence can make in your daily wellness journey.
        </Typography>
      </Collapse>

      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          onClick={handleToggle}
          endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{
            textTransform: "none",
            fontSize: { xs: 14, md: 16, lg: 18 },
            fontWeight: 600,
            color: "text.secondary",
          }}
        >
          {expanded ? "Read Less" : "Read More"}
        </Button>
      </Box>
    </Box>
  );
};

export default SEOSection;
