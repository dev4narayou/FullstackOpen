import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('that a displayed note only shows the author and blog title by default', async () => {
  const blog = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 0,
  }

  let container = render(<Blog blog={blog} />).container

	const targetBlog = await screen.findByText('Test Title Test Author');
	expect(targetBlog).toBeDefined();

	const div = container.querySelector('.defaultVisible');
	expect(div).toBeDefined();
	expect(div).not.toHaveStyle('display: none');
})