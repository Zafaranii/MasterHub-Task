import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

function QuizResults() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [