export const HomeSocial = () => {
  return (
    <div className="my-8">
      <h3 className="text-xl md:text-2xl">Social networks</h3>
      <div className="my-2 md:my-4 px-4">
        <ul className="list-disc">
          <li>
            <a
              className="dark:text-blue-500 dark:hover:text-blue-600"
              href="https://www.linkedin.com/in/jorgedelacruz07"
              rel="noreferrer"
              target="_blank"
            >
              Linkedin
            </a>
          </li>
          <li>
            <a
              className="dark:text-blue-500 dark:hover:text-blue-600"
              href="https://github.com/jorgedelacruz07"
              rel="noreferrer"
              target="_blank"
            >
              GitHub
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};
