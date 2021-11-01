import { useTranslation } from "react-i18next";
import Container from "../../components/Container";
import SubTitle from "../../components/SubTitle";
import Title from "../../components/Title";
import { ExercisesProvider } from "../../contexts/ExercisesContext";
import { useUser } from "../../contexts/user-context";
import ExerciseResultVisualization from "../../fragments/ExerciseResultVisualization";
import Header from "../../fragments/Header";

const StudentHome = () => {
  const { t } = useTranslation();
  const { user } = useUser();

  if (!user) return null;

  return (
    <>
      <Header />
      <Container className="max-w-full">
        <Title variant={2}>{t("Dashboard")}</Title>
        <SubTitle>{`${user.firstName} ${user?.lastName}`}</SubTitle>

        <section className="my-8">
          <Title variant={2}>{t("Exercises")}</Title>
          <ExercisesProvider>
            <ExerciseResultVisualization className="mt-4" />
          </ExercisesProvider>
        </section>
      </Container>
    </>
  );
};

export default StudentHome;
