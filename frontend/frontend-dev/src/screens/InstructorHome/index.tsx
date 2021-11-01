import { useTranslation } from "react-i18next";
import Container from "../../components/Container";
import AdminRedirect from "../../components/Redirect/AdminRedirect";
import Title from "../../components/Title";
import { ExercisesProvider } from "../../contexts/ExercisesContext";
import { useUser } from "../../contexts/user-context";
import ExerciseResultVisualization from "../../fragments/ExerciseResultVisualization";
import Header from "../../fragments/Header";

const InstructorHome = () => {
  const { t } = useTranslation();
  const { user } = useUser();

  return (
    <>
      <AdminRedirect />
      <Header />
      <Container>
        <Title>{t("Instructor Dashboard")}</Title>
        <ExercisesProvider>
          <ExerciseResultVisualization
            className="mt-4"
            viewAsStaff={user?.isStaff}
          />
        </ExercisesProvider>
      </Container>
    </>
  );
};

export default InstructorHome;
