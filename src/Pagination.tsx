import React, { useState } from "react";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import MuiPagination from "@material-ui/lab/Pagination";
import { usersData } from "./UserList";
import { ApiTypes } from "./Types";

interface AppProps {
  searchedName: string;
  totalNumber: number;
  page: number;
  addUsersData: (userInfo: usersData) => void;
  onPageButtonClick: (page: number) => void;
}

const Pagination: React.FC<AppProps> = ({
  searchedName,
  totalNumber,
  page,
  addUsersData,
  onPageButtonClick,
}) => {
  // -----ðstyling-------
  const PageStyle = withStyles({
    root: {
      display: "inline-block",
    },
  })(MuiPagination);
  // --------------------

  const [usersData, setUsersData] = useState<usersData | []>([]);

  const per_page = 50;
  const setPageNumber = () => {
    if (totalNumber <= 1000 && Number.isInteger(totalNumber / per_page)) {
      //50ã§å²ã£ãæã«æ´æ°ãªãããã®æ´æ°ã®ç­ãããã¼ã¸æ°
      return totalNumber / per_page;
    }
    if (
      totalNumber <= 1000 &&
      Number.isInteger(totalNumber / per_page) === false
    ) {
      // å°æ°ç¹åãæ¨ã¦ã®æ°ï¼ï¼
      return Math.floor(totalNumber / per_page + 1);
    }
    if (totalNumber > 1000) {
      return 20;
    }
  };

  const onButton_click = (e: React.ChangeEvent<unknown>, page: number) => {
    onPageButtonClick(page);

    // -----------ðGet Users Data-----------
    // ðæ¼ãããã¼ã¸ã®ãã¼ã¿ããã§ã«åå¾ãããã¨ãããå ´åãã­ã¼ã«ã«ã®ãã¼ã¿ããæå ±åå¾ãã
    //  = if(userDataã®ä¸­ã«ãâ item.page === æ¼ãããã¼ã¸æ°ã&& â¡ãitem.searchedName ===æ¤ç´¢ããååãã®ä¸¡æ¹ãæã¤ãã®ããã
    if (
      usersData.some(
        (item) => item.page === page && item.searchedName === searchedName
      )
    ) {
      const thisPageData = usersData.filter((item) => item.page === page);
      addUsersData(
        thisPageData.map((item) => ({
          login: item.login,
          avatar_url: item.avatar_url,
          html_url: item.html_url,
          page: page,
          searchedName: searchedName,
        }))
      );
    }
    // ðããä»¥å¤(ãã®æ¤ç´¢ãã¼ã ã§ãã®ãã¼ã¸ãåãã¦ã®æ)ã¯å¨ã¦APIããåå¾
    else {
      axios
        .get("https://api.github.com/search/users", {
          params: {
            q: searchedName,
            page: page,
            per_page: 50,
          },
        })
        .then((resp) => {
          const matchedData = resp.data.items.filter(
            (item: ApiTypes) => item.login.indexOf(searchedName) >= 0
          );
          const dataWithPage = matchedData.map((item: ApiTypes) => ({
            login: item.login,
            avatar_url: item.avatar_url,
            html_url: item.html_url,
            page: page,
            searchedName: searchedName,
          }));
          addUsersData(dataWithPage);
          setUsersData([...usersData, ...dataWithPage]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // ----------------------
  };

  return (
    <div style={{ textAlign: "center" }}>
      <PageStyle
        count={setPageNumber()}
        color="primary"
        page={page}
        onChange={onButton_click}
        size="large"
      />
    </div>
  );
};
export default Pagination;
