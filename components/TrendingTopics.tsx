import {  Typography, Carousel, Card, Modal, Button } from "antd";
import { useState } from "react";

const { Title, Paragraph, Text} = Typography;

interface Article {
    title: string;
    description: string;
    url: string;
    content: string;
    urlToImage: string;
    source: { name: string };
    publishedAt: string;

}

function formatDate(dateString:string) {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Jakarta'
    }) + ' WIB';
}



export default function TrendingTopics({ trendNews }: { trendNews: Article[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
    
    const showModal = (article:Article) => {
        setCurrentArticle(article);
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setCurrentArticle(null);
    };

    if (!trendNews || trendNews.length === 0) {
        return <Title level={4} style={{ color: 'white' }}>Loading trending news...</Title>;
    }
    return(
        <>
            <Carousel autoplay={{ dotDuration: true }}  className="w-[600px] h-max" autoplaySpeed={4000}>
                {trendNews.map((trendNew)=>(
                    <div key={trendNew.url}
                    className="w-full h-full" >
                        <Card hoverable 
                            cover={<img alt={trendNew.title} src={trendNew.urlToImage} className="h-[300px] object-cover" />}
                            onClick={() => showModal(trendNew)}
                            // style={{ backgroundImage: `url(${trendNew.urlToImage})` }} 
                            >
                            <Typography>
                                <Title level={3}>{trendNew.title}</Title>
                                </Typography>
                            </Card>
                        </div>
                    ))}
            </Carousel>
            <Modal
                title="Article Detail"
                open={isModalOpen}
                onCancel={handleCancel}
                maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}  // atur opacity sesuai keinginan
                footer={[
                <Button key="learnmore" type="primary" onClick={() => window.open(currentArticle?.url, '_blank')}>
                    Learn More
                </Button>,
                ]}
            >
                {currentArticle && (
                <>
                    <Title level={4}>{currentArticle.title}</Title>
                    <Paragraph>{currentArticle.content}</Paragraph>
                    <Text strong>Source: {currentArticle.source?.name || 'Unknown'}</Text><br/>
                    <Text strong>Publish: {formatDate(currentArticle.publishedAt)}</Text>
                </>
                )}
            </Modal>
        </>
    )
}