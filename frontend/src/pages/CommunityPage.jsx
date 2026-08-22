import React, { useState, useMemo } from 'react';
import { COMMUNITY_POSTS } from '../data/mockData';
import SearchFilterToolbar from '../components/ui/SearchFilterToolbar';
import { Heart, MessageCircle } from 'lucide-react';

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredPosts = useMemo(() => {
    return COMMUNITY_POSTS.filter(post => 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tripName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8 w-full">
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex-1">
          <SearchFilterToolbar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            groupByOptions={[
              {value: 'destination', label: 'Destination'},
              {value: 'date', label: 'Date'}
            ]}
            sortByOptions={[
              {value: 'recent', label: 'Most Recent'},
              {value: 'popular', label: 'Most Popular'},
              {value: 'comments', label: 'Most Comments'}
            ]}
          />
        </div>
        <div className="md:w-1/3 bg-[#f3f4f5] p-6 rounded-xl border border-[#e1e3e4]">
          <p className="font-['Inter'] text-[#444651] text-sm">
            Community section where all the users can share their experience, travel stories, tips, or activities. Using the Search, Group by, Filter and Sorting option, the user can narrow down the result that he is looking for.
          </p>
        </div>
      </div>

      <h1 className="font-['Montserrat'] text-2xl font-bold text-[#191c1d] mb-6">Community Tab</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {filteredPosts.map(post => (
          <div key={post.id} className="bg-white rounded-xl border border-[#e1e3e4] p-6 hover:shadow-md transition-shadow flex gap-4">
            <img 
              src={post.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.userName)}&background=random`} 
              alt={post.userName} 
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-['Inter'] font-semibold text-[#191c1d]">{post.userName}</h3>
                <span className="text-[#757682] text-sm">• {post.destination} • {post.tripName}</span>
              </div>
              <p className="font-['Inter'] text-[#444651] mb-4">{post.content}</p>
              
              <div className="flex items-center gap-6 text-[#757682]">
                <button className="flex items-center gap-1.5 hover:text-[#00236f] transition-colors">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{post.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-[#00236f] transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{post.comments}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12 text-[#757682] font-['Inter']">
            No community posts found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
