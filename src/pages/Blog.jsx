import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Form, Alert, Modal, Collapse } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showComments, setShowComments] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [currentComment, setCurrentComment] = useState(null);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('You need to be logged in to view the blog list.');
      navigate('/login');
      return;
    }

    // Fetch current user data
    fetch(`${import.meta.env.VITE_API_URL}/users/details`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(userData => {
        if (userData.user) {
          setCurrentUser(userData.user);
        } else {
          setError('Failed to fetch user data.');
          navigate('/login');
        }
      })
      .catch(error => {
        setError('An error occurred while fetching user data.');
        console.error('Error fetching user data:', error);
      });

    // Fetch blog data
    fetch(`${import.meta.env.VITE_API_URL}/blogs/posts`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.blogs) {
          setBlogs(data.blogs);
          setError('');
        } else {
          setError('Failed to fetch blogs.');
        }
      })
      .catch(error => {
        setError('An error occurred while fetching blogs.');
        console.error('Error fetching blogs:', error);
      });
  }, [navigate]);

  const handleAddBlog = () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setError('You need to be logged in to add a blog post.');
      navigate('/login');
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/blogs/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === "Blog created successfully") {
          setBlogs([...blogs, data.blog]);
          setTitle('');
          setContent('');
          setShowAddModal(false);
          Swal.fire({
            title: "Blog post added successfully!",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Failed to add blog post.",
            icon: "error",
          });
        }
      })
      .catch(error => {
        Swal.fire({
          title: "An error occurred while adding the blog post.",
          icon: "warning",
        });
        console.error('Error adding blog post:', error);
      });
  };

  const handleUpdateBlog = () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setError('You need to be logged in to update a blog post.');
      navigate('/login');
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/blogs/posts/${currentBlog._id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const updatedBlogs = blogs.map(blog => blog._id === currentBlog._id ? data.blog : blog);
          setBlogs(updatedBlogs);
          setCurrentBlog(null);
          setTitle('');
          setContent('');
          Swal.fire({
            title: "Blog post updated successfully!",
            icon: "success",
          });
          setShowUpdateModal(false);
        } else {
          Swal.fire({
            title: "Failed to update blog post.",
            icon: "error",
          });
        }
      })
      .catch(error => {
        Swal.fire({
          title: "An error occurred while updating the blog post.",
          icon: "warning",
        });
        console.error('Error updating blog post:', error);
      });
  };

  const handleDeleteBlog = () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setError('You need to be logged in to delete a blog post.');
      navigate('/login');
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/blogs/posts/${currentBlog._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === "Blog deleted successfully") {
          const updatedBlogs = blogs.filter(blog => blog._id !== currentBlog._id);
          setBlogs(updatedBlogs);
          setCurrentBlog(null);
          Swal.fire({
            title: "Blog post deleted successfully!",
            icon: "success",
          });
          setShowDeleteModal(false);
        } else {
          Swal.fire({
            title: "Failed to delete blog post.",
            icon: "error",
          });
        }
      })
      .catch(error => {
        Swal.fire({
          title: "An error occurred while deleting the blog post.",
          icon: "warning",
        });
        console.error('Error deleting blog post:', error);
      });
  };

  const handleAddComment = () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        setError('You need to be logged in to add a comment.');
        navigate('/login');
        return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/blogs/posts/${currentBlog._id}/comments`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: comment }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response Data:', data);

        if (data.message === "Comment added successfully") {
            // Check if data.comment exists
            const newComment = data.comment || {};  // Default to empty object if undefined
            const updatedBlogs = blogs.map(blog => 
                blog._id === currentBlog._id ? { ...blog, comments: [...blog.comments, newComment] } : blog
            );
            setBlogs(updatedBlogs);
            setComment('');
            setShowComments(prevState => ({ ...prevState, [currentBlog._id]: false }));
            Swal.fire({
                title: "Comment added successfully!",
                icon: "success",
            });
        } else {
            Swal.fire({
                title: "Failed to add comment.",
                icon: "error",
            });
        }
    })
    .catch(error => {
        Swal.fire({
            title: "An error occurred while adding the comment.",
            icon: "warning",
        });
        console.error('Error adding comment:', error);
    });
};


  const handleDeleteComment = () => {
    const token = localStorage.getItem('accessToken');
    setShowDeleteCommentModal(false);
    
    if (!token) {
      setError('You need to be logged in to delete a comment.');
      navigate('/login');
      return;
    }
  
    if (!currentComment || !currentBlog) {
      Swal.fire({
        title: "No comment or blog selected.",
        icon: "error",
      });
      return;
    }
  
    fetch(`${import.meta.env.VITE_API_URL}/blogs/posts/${currentBlog._id}/comments/${currentComment._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.message === "Comment deleted successfully") {
          // Filter comments from the current blog
          const updatedBlogs = blogs.map(blog => 
            blog._id === currentBlog._id 
              ? { ...blog, comments: blog.comments.filter(comment => comment._id !== currentComment._id) }
              : blog
          );
          setBlogs(updatedBlogs);
          setCurrentComment(null);
          Swal.fire({
            title: "Comment deleted successfully!",
            icon: "success",
          });
          setShowDeleteCommentModal(false);
        } else {
          Swal.fire({
            title: "Failed to delete comment.",
            icon: "error",
          });
        }
      })
      .catch(error => {
        Swal.fire({
          title: "An error occurred while deleting the comment.",
          text: error.message,
          icon: "warning",
        });
        console.error('Error deleting comment:', error);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <Container>
      {currentUser && (
        <Button variant="link" onClick={handleLogout} className="mb-3 float-end">
          Logout
        </Button>
      )}
      <h1 className="my-4">Blog List</h1>
      <Button className="mb-4" onClick={() => setShowAddModal(true)}>Add Blog Post</Button>
      {blogs.map(blog => (
  <Card key={blog._id} className="mb-3">
    <Card.Body>
      <Card.Title>{blog.title}</Card.Title>
      <Card.Text>{blog.content}</Card.Text>
      <Button variant="outline-info" onClick={() => { setCurrentBlog(blog); setShowUpdateModal(true); }}>Update Blog</Button>
      <Button variant="outline-danger" onClick={() => { setCurrentBlog(blog); setShowDeleteModal(true); }}>Delete Blog</Button>
      <Button variant="outline-primary" onClick={() =>{ setCurrentBlog(blog); setShowComments(prevState => ({ ...prevState, [blog._id]: !prevState[blog._id] }))}}>
        {showComments[blog._id] ? 'Hide Comments' : 'Show Comments'}
      </Button>

      <Collapse in={showComments[blog._id]}>
        <div>
          <Form.Control
            as="textarea"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment"
          />
          <Button variant="outline-primary" onClick={handleAddComment} className="mt-2">Add Comment</Button>

          {blog.comments.map(comment => (
            <div key={comment._id} className="mt-3">
                <p>{comment.content || 'No content'}</p>
                {currentUser && (
                    <>
                        <Button
                            variant="outline-danger"
                            onClick={() => {
                                setCurrentComment(comment);
                                setShowDeleteCommentModal(true);
                            }}
                        >
                            Delete
                        </Button>
                    </>
                )}
            </div>
          ))}

        </div>
      </Collapse>
    </Card.Body>
  </Card>
))}

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Blog Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="blogTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="blogContent">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="outline-success"
              onClick={handleAddBlog}
              className="mt-3"
            >
              Add Blog
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Blog Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="updateBlogTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="updateBlogContent">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="outline-success"
              onClick={handleUpdateBlog}
              className="mt-3"
            >
              Update Blog
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Blog Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this blog post?</p>
          <Button
            variant="outline-danger"
            onClick={handleDeleteBlog}
          >
            Delete Blog
          </Button>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteCommentModal} onHide={() => setShowDeleteCommentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this Comment?</p>
          <Button variant="outline-danger" onClick={handleDeleteComment}>
            Delete Comment
          </Button>
        </Modal.Body>
      </Modal>

    </Container>
  );
};

export default BlogList;