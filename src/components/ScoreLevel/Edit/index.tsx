import { Box, Button, IconButton } from '@material-ui/core';
import { Formik, FormikProps, Form } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import ScoreLevelFormSchema from './validations';
import useStyles from './styles';
import api from '../../../services/api';
import { useHeaderTitle } from '../../../contexts/headerTitle';
import ScoreLevelInfo from '../Forms/ScoreLevelInfo';
import { IScoreLevelEditForm, IScoreLevel } from '../../../interfaces/IScoreLevel';
import { INITIAL_FORM_VALUES } from '../../../constants/scoreLevel';

function Edit() {
  const classes = useStyles();
  const [scoreLevelInfo, setScoreLevelInfo] = useState<IScoreLevelEditForm>(INITIAL_FORM_VALUES);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();

  const history = useHistory();
  const { setTitle } = useHeaderTitle();

  useEffect(() => {
    setTitle('Edição de Nível de Pontuação');
  }, []);

  useEffect(() => {
    api.get(`/score-level/${id}`).then(async response => {
      const { data }: { data: IScoreLevel } = response.data;

      const values: IScoreLevelEditForm = {
        score_level_name: data.name,
        score_level_pointsThreshold: data.pointsThreshold,
        score_level_benefits: data.benefits,
        score_level_insert_benefit: { label: '', value: '' }
      };

      setScoreLevelInfo(values);
      setLoading(false);
    });
  }, []);

  const handleOnSubmit = useCallback(async (values: IScoreLevelEditForm, actions) => {
    const benefitPayload = {
      name: values.score_level_name,
      pointsThreshold: values.score_level_pointsThreshold,
      benefits: values.score_level_benefits.map(benefit => benefit._id)
    };

    try {
      await api.put(`/score-level/${id}`, benefitPayload);

      actions.setSubmitting(false);
      toast.success('Nível atualizado com sucesso!');
      history.push('/score-level');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(`Falha na atualização do nível: ${err.response?.data.error}`);
        actions.setSubmitting(false);
      } else {
        toast.error(`Falha na atualização do nível`);
        actions.setSubmitting(false);
      }
    }
  }, []);

  return loading ? null : (
    <>
      <div className={classes.tabs}>
        <IconButton onClick={() => history.goBack()}>
          <KeyboardBackspaceIcon />
        </IconButton>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }} />
      </div>
      <div className={classes.content}>
        <Formik initialValues={scoreLevelInfo} validationSchema={ScoreLevelFormSchema} onSubmit={handleOnSubmit}>
          {({ isValid, isSubmitting }: FormikProps<IScoreLevelEditForm>) => (
            <Form>
              <div className={classes.formContainer}>
                <ScoreLevelInfo />
              </div>

              <div className={classes.footerButtons}>
                <Button
                  className={classes.saveButton}
                  color='secondary'
                  variant='contained'
                  type='submit'
                  disabled={!isValid || isSubmitting}
                  startIcon={<SaveIcon />}
                >
                  Salvar
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default Edit;
