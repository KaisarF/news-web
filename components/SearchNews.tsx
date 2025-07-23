
import { Card, Typography, List, Modal, Button, Input } from "antd";
import { useEffect, useState, useRef } from "react";
import api from "../services/Axios";

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

export default function SearchNews() {
    const [searchResults, setSearchResults] = useState<Article[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
    const [searchValue, setSearchValue] = useState("");
    const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
    const debounceRef = useRef<number | null>(null);


    const handleSearchDebounced = (query:string) => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = window.setTimeout(() => {
            fetchNews(query);
        }, 500);
    };

    const fetchNews = async (query:string) => {
        const q = query && query.trim() !== "" ? query : "a";
        try {
            const response = await api.get(`/everything?q=${q}&apiKey=${API_KEY}`);
            setSearchResults(response.data.articles);
        } catch (error) {
            console.error("Failed to fetch search results:", error);
            setSearchResults([]);
        }
    };


    useEffect(() => {
        fetchNews("");

    }, []);

    const showModal = (article:Article) => {
        setCurrentArticle(article);
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setCurrentArticle(null);
    };

    return (
        <div className="w-full flex flex-col items-center justify-center py-10">
            <Typography.Title level={2}>Search News</Typography.Title>
            <Typography.Paragraph>
                Use the search bar to find news articles on specific topics.
            </Typography.Paragraph>
            <Input.Search
                placeholder="Search for news..."
                // enterButton="Search"
                size="large"
                className="w-[600px] my-5"
                value={searchValue}
                onChange={e => {
                    setSearchValue(e.target.value);
                    handleSearchDebounced(e.target.value);
                }}
                onSearch={value => {
                    setSearchValue(value);
                    fetchNews(value);
                }}
            />
            <List
                itemLayout="vertical"
                size="large"
                pagination={{
                    pageSize: 5,
                }}
                dataSource={searchResults}
                renderItem={(item) => (
                    <List.Item
                        key={item.url}
                        // actions={[
                        //     <Button type="primary" onClick={() => showModal(item)}>
                        //         Read More
                        //     </Button>,
                        // ]}
                        onClick={() => showModal(item)}
                    >
                        <Card 
                        hoverable 
                        cover={<img alt={item.title} 
                        src={item.urlToImage} 
                        
                        />}>
                            <Typography.Title level={4}>{item.title}</Typography.Title>
                            <Typography.Paragraph>{item.description}</Typography.Paragraph>
                        </Card>
                    </List.Item>
                )}
            />
            {currentArticle && (
                <Modal
                title='Article Detail'
                open={isModalOpen}
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
                            <Text strong>publish: {formatDate(currentArticle?.publishedAt)}</Text>
                </Modal>
            )}
        </div>
    );
}