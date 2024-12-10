import { Button, Text, Box, Flex, hubspot } from "@hubspot/ui-extensions";

hubspot.extend(({ actions }) => <Extension openIframe={actions.openIframeModal} />, {
  type: "crm-card",
  location: "crm.deals.tab"
});

const Extension = ({ openIframe }) => {
  const handleClick = () => {
    openIframe({
      uri: "https://hubspot-brands.onrender.com/allocation-form",
      height: 600,
      width: 500,
      title: 'Brand Allocation',
    });
  };

  return (
    <Box>
      <Button onClick={handleClick}>
        Allocate Brands
      </Button>
    </Box>
  );
};
