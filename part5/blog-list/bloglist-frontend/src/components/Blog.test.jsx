import { render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

test('that the URL and number of likes are shown when the view button is clicked', async () => {

  const blog = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 0,
  }

	let container = render(<Blog blog={blog} />).container

	const viewButton = await screen.findByText('view');
	const user = userEvent.setup()
	await user.click(viewButton);

	const div = container.querySelector('.defaultHidden');
	expect(div).toBeDefined();
	expect(div).not.toHaveStyle('display: none');

	const url = within(container.querySelector('.defaultHidden')).getByText('http://test.com', { exact: false });
  expect(url).toBeDefined();

  const likes = within(container.querySelector('.defaultHidden')).getByText('0', { exact: false });
  expect(likes).toBeDefined();
})

test('that if the like button is clicked twice, the event handler the component received as props is called twice', async () => {
  const blog = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 0,
  }

	const mockHandler = vi.fn()
	const user = userEvent.setup()

	let container = render(<Blog blog={blog} updateBlog={mockHandler} />).container

	const viewButton = await screen.findByText('view');
	await user.click(viewButton);

	const likeButton = await screen.findByText('like');
	await user.click(likeButton);
	await user.click(likeButton);

	expect(mockHandler.mock.calls).toHaveLength(2)

})