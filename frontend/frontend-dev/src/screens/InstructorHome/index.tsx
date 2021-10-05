import { useTranslation } from "react-i18next";
import Container from "../../components/Container";
import AdminRedirect from "../../components/Redirect/AdminRedirect";
import Title from "../../components/Title";
import { useUser } from "../../contexts/user-context";
import ExerciseDetails from "../../fragments/ExerciseDetails";
import Header from "../../fragments/Header";
import { IExercise } from "../../models/Exercise";
import { useExerciseList } from "../../services/exercises";

const InstructorHome = () => {
  const { t } = useTranslation();
  const { user } = useUser();

  const token = user?.token || "";
  const offering = 1;

  const { exerciseList } = useExerciseList(offering, token);

  return (
    <>
      <AdminRedirect />
      <Header />
      <Container>
        <Title>{t("Instructor Dashboard")}</Title>
        <div className="grid gap-1 grid-cols-3 mt-4">
          {exerciseList.map((item: IExercise) => (
            <ExerciseDetails
              key={`exercise-${item.slug}`}
              offering={offering}
              slug={item.slug}
            />
          ))}
        </div>
      </Container>
    </>
  );
};

export default InstructorHome;
