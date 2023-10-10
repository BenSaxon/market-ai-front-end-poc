import { Box, Card, CardProps, HStack, Heading, Image, Text } from "@chakra-ui/react"

interface ProductCardProps extends CardProps {
    title: string
    quantitySold: number
    imageUrl: string
}

const ProductCard: React.FC<ProductCardProps> = ({title, quantitySold, imageUrl, ...rest}) => {
    return (
        <Card w="100%" {...rest} p="20px">
            <HStack alignItems="flex-start">
                <Image src={imageUrl} alt="cocktail" w="50%"/>
                <Box>
                    <Heading as="h3">{title}</Heading>
                    <Text>Total sold: {quantitySold}</Text>
                </Box>
            </HStack>
        </Card>
    )
}
export default ProductCard