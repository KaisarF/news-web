import { Tabs, Typography, List, Modal, Button} from "antd"
import { useEffect, useState } from "react";

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
import api from "../services/Axios";


// const { Meta } = Card;
const categories = [
  { key: 'sport', label: 'Sport' },
  { key: 'tech', label: 'Tech' },
  { key: 'politics', label: 'Politics' },
  { key: 'economy', label: 'Economy' },
  { key: 'crime', label: 'Crime' },
  { key: 'culture', label: 'Culture' },
  { key: 'earth', label: 'Earth' },
];

const { Title, Paragraph, Text} = Typography;

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
export default function TopicsList(){
    const [categoryNews, setCategoryNews] = useState<Article[]>([]);
    const [selectedCategory, setSelectedCategory] = useState(categories[0].key);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentArticle, setCurrentArticle] = useState<Article | null>(null)
    
    useEffect(()=>{
        const getCategoryNews = async ()=>{
            try {
                const response = await api.get(`/everything?q=${selectedCategory}&apiKey=${API_KEY}`)
                setCategoryNews(response.data.articles)
            } catch (error) {
                console.error("Failed to fetch News:", error);
                setCategoryNews([])
            }
        }
        getCategoryNews()
    },[selectedCategory])
    const showModal = (article:Article) => {
        setCurrentArticle(article);
        setIsModalOpen(true);
    };

    // const handleOk = () => {
    //     setIsModalOpen(false);
    //     setCurrentArticle(null);
    // };

    const handleCancel = () => {
        setIsModalOpen(false);
        setCurrentArticle(null);
    };
    return(
        <Tabs
            defaultActiveKey="sport"
            onChange={(key) => setSelectedCategory(key)}
            centered
            type="card"
            items={categories.map(cat => ({
                label: cat.label,
                key: cat.key,
                children: (
                    <div>
                        <Title level={2}>{cat.label} News</Title>
                        <Paragraph>
                            Explore the latest news in {cat.label.toLowerCase()}.
                        </Paragraph>
                        <Text strong>Click on a news item to see more details.</Text>
                        <br />
                        <List
                            itemLayout="vertical"
                            size="large"
                            pagination={{
                            onChange: (page) => {
                                console.log(page);
                            },
                            pageSize: 10,
                            }}
                            dataSource={categoryNews}
                            renderItem={(categoryNews)=>(
                                <List.Item
                                    key={categoryNews.url}
                                    extra={
                                        <img
                                        width={300}
                                        alt={categoryNews.title}
                                        src={categoryNews.urlToImage}
                                        />
                                    }
                                    onClick={()=>showModal(categoryNews)}
                                >
                                    <List.Item.Meta
                                    title={<Title level={4}>{categoryNews.title}</Title>}
                                    description={<p>{categoryNews.description}</p>}
                                    
                                    />

                                </List.Item>
                            )}
                        />
                        <Modal
                            title='Article Detail'
                            open={isModalOpen}
                            // onOk={handleOk}
                            onCancel={handleCancel}
                            footer={[
                                <Button key="learnmore" type="primary" onClick={() => window.open(currentArticle?.url, '_blank')}>
                                    Learn More
                                </Button>,
                                
                            ]}
                        >
                            <Title level={4}>{currentArticle?.title}</Title>
                            <Paragraph>{currentArticle?.content}</Paragraph>
                            <Text strong>sources: {currentArticle?.source?.name ? currentArticle.source.name : "Unknown"}</Text>
                            <br/>
                            <Text strong>publish: {formatDate(currentArticle?.publishedAt ?? "")}</Text>
                        </Modal>
                    </div>
                )
            }))}
        />
    )
}