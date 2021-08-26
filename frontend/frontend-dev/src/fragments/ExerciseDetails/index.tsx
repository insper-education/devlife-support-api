import axios from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../components/Button";
import Container from "../../components/Container";
import { useUser } from "../../contexts/user-context";
import { Answer } from "../../models/Answer";

const ExerciseDetails = (props:any) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [numSubmissions, setNumSubmissions] = useState<number>(0);
  const [lastRefresh, setLastRefresh] = useState<Date>();
  const { t } = useTranslation();
  const { user} = useUser();

  const offering = props.offering;
  const slug = props.slug;
  const EXERCISE_DETAILS_URL = `/api/offerings/${offering}/exercises/${slug}/answers/`
  
  const handleDetails = (ev:any) => {
    axios.get(EXERCISE_DETAILS_URL, {
      headers: {
        Authorization: `Token ${user?.token}`,
      },
    })
    .then((res) => res.data)
    .then((data) => {
      console.log(data);
      let answerList:Array<Answer> = data;
      setNumSubmissions(answerList.length);
      setLastRefresh(new Date());
      setShowDetails(true);
    });
  };
  
  return (
    <Container className="bg-gray-100 p-4 m-4 flex flex-wrap">
      <p className="flex-grow">
        {slug}
      </p>
      <Button onClick={handleDetails} className="object-right">
        {t("Reload")}
      </Button>
      
      <p className="w-full">
        { showDetails && (
          <p> {numSubmissions} {t("were sent before")} {lastRefresh?.toLocaleString()} </p>
        )}
      </p>
    </Container>
  )
}
    
export default ExerciseDetails;