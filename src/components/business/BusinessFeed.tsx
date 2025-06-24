
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Plus, Calendar, MessageSquare } from 'lucide-react';
import { businessPostsApi } from '@/services/api/businessPostsService';
import { XanoBusinessPost } from '@/services/api/types';
import { toast } from 'sonner';

interface BusinessFeedProps {
  businessId: string;
}

const BusinessFeed: React.FC<BusinessFeedProps> = ({ businessId }) => {
  const [posts, setPosts] = useState<XanoBusinessPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    fetchPosts();
  }, [businessId]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const fetchedPosts = await businessPostsApi.getBusinessPosts(Number(businessId));
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    setIsCreating(true);
    try {
      const createdPost = await businessPostsApi.createBusinessPost({
        business_id: Number(businessId),
        title: newPost.title,
        content: newPost.content,
      });
      
      setPosts([createdPost, ...posts]);
      setNewPost({ title: '', content: '' });
      setShowCreateForm(false);
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setIsCreating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Create Post Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Share an Update
            </CardTitle>
            {!showCreateForm && (
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Post
              </Button>
            )}
          </div>
        </CardHeader>
        
        {showCreateForm && (
          <CardContent className="space-y-4">
            <Input
              placeholder="Post title..."
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            />
            <Textarea
              placeholder="Share what's happening with your business..."
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              rows={4}
            />
            <div className="flex gap-2">
              <Button 
                onClick={handleCreatePost}
                disabled={isCreating}
              >
                {isCreating ? 'Publishing...' : 'Publish Post'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewPost({ title: '', content: '' });
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Posts List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">Loading posts...</p>
            </CardContent>
          </Card>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-4">
                Share your first update with the community!
              </p>
              {!showCreateForm && (
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Post
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {formatDate(post.created_at)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BusinessFeed;
