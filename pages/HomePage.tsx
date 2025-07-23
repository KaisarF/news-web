import { Flex, Typography, Carousel, Card, Input } from "antd";

import api from '../services/Axios'

import { useEffect, useState } from "react";

import TrendingTopics from "../components/TrendingTopics";
import TopicsList from "../components/TopicsList";
import SearchNews from "../components/SearchNews";

const { Title, Paragraph, Text, Link } = Typography;

// console.log('API Key:', process.env.REACT_APP_NEWS_API_KEY);

export default function HomePage(){
    const [trendNews, setTrendNews] = useState([]);
    const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

    useEffect(()=>{
        const getTrendNews = async ()=>{
            try {
                const response = await api.get(`/top-headlines?country=us&apiKey=${API_KEY}`)
                setTrendNews(response.data.articles)
            } catch (error) {
                console.error("Failed to fetch articles:", error);
                setTrendNews([])
            }
        }
        getTrendNews()
    },[])

    return(
        <div className="w-full items-center justify-center flex flex-col" >
            <Flex className="w-full" align={'center'}vertical={true} >
                <Title className='my-10' level={1} >KaazanNews</Title>
                <Paragraph className='text-center text-gray-500' >
                    Stay updated with the latest news from around the world. Explore trending topics and categories that interest you.
                </Paragraph>

            </Flex>
            <div className="w-full flex flex-row items-start justify-center ">
                <div className="w-4/6 flex flex-col items-center justify-center">
                    <div className="w-full flex flex-col items-center justify-center bg-gray-800 py-5 my-5">
                        <Title level={1} style={{ color: 'white' }}>TRENDING TOPICS </Title>
                        <TrendingTopics trendNews={trendNews} />
                    </div>
                    <div className=" w-[700px] py-10 ">
                        <Title level={2} className="text-center mb-5">Explore Topics</Title>
                        <Paragraph className="text-center text-gray-500 mb-5">  
                            Browse through various categories to find news that interests you.
                        </Paragraph>
                        <TopicsList/>
                    </div>
                </div>
                <div className="w-2/6 flex flex-col items-center justify-center px-10 py-15">
                    <SearchNews/>
                </div>
            </div>
            
        </div>
    )
}