import React, { FC, ReactElement } from 'react';

interface IMainPageProps {
  pageName: string;
  children?: ReactElement;
}

export const MainPage: FC<IMainPageProps> = () => {
  return (
    <div className="App">
      <div id="hero" className="my-6">
        <div className="text-5xl font-black font-display">HELLO WORLD</div>
      </div>
    </div>
  );
};
export default MainPage;
