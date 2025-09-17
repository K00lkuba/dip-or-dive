import { CaseStudy } from "./types";

export const caseStudy1: CaseStudy = {
  id: "case-1",
  title: "Case 1 - Mr James Garrett",
  case: `Mr James Garrett is a 65-year old New Zealand European male with a history of hypertension and cigarette smoking. He works as a mechanic.

While out for a walk he became unsteady and weak on the left side of his body. He had double vision and needed support from his wife to sit down.

His wife called an ambulance. The ambulance officers noted that he was unable to look to the right with his right eye and also that the right side of his face was completely paralysed.`,
  questions: [
    {
      id: "q1",
      number: 1,
      text: "What is the most likely cause of the event which Mr Garrett is experiencing?",
      answer: "Ischemic stroke in the brainstem"
    },
    {
      id: "q2", 
      number: 2,
      text: "Identify and explain the pathophysiological basis for ALL the neurological abnormalities in the history above.",
      answer: `Ensure you name the:
particular structures that have been affected
AND the side on which they are located.

Left sided weakness and unsteadiness: Right Corticospinal tract at the level of the pons
The corticospinal tract carries the motor signals from the CNS to the opposite side of the body. Since the motor fibres cross over in the medullary pyramids a lesion in the right corticospinal tract in the pons will cause weakness and unsteadiness on the left side of the body (contralaterally)

Double vision and Right eye abduction: Right abducens nerve (CN VI) and or nucleus in the pons
The abducens nerve innervates the right lateral rectus muscle of the eye that causes abduction. A lesion in the right abducens nerve or its nucleus would cause the right eye to be unable to move to the right, resulting in double vision (diplopia) due to misalignment of the eyes.

The medial longitudinal fasciculus (MLF) also runs in the medial caudal pons. Lesions here can cause a disorder of conjugate gaze, which can present as double vision.

Right sided face complete paralysis: Right facial (CN VII) nerve or nucleus in the pons
The facial nerve controls the muscles of facial expression. A lesion in the right facial nerve or its nucleus will cause paralysis of the facial muscles on the same side (ipsilateral), leading to right-sided facial paralysis. This is a lower motor neuron lesion as it affects the entire side of the face`
    },
    {
      id: "q3",
      number: 3,
      text: "What is the level of the nervous system that has been affected?",
      answer: `Right sided caudal pons lesion (medial)

Corticospinal tract passes through the pons before decussation
Abducens nuclei is located medially in the pons
Facial nuclei is located medially in the pons

Lesion in the right primary motor cortex due to MCA damage
Contralateral motor weakness of the body similar to a pontine lesion. However, the facial paralysis in an MCA stroke would typically be upper motor neuron in nature. This means that only the lower face would be affected, while the upper face (forehead) would be spared due to bilateral cortical innervation of the upper facial muscles.

In a cortical lesion, cranial nerve nuclei are not directly affected. Therefore, you wouldn't see the ipsilateral facial nerve (CN VII) or abducens nerve (CN VI) palsies seen in Mr. Garrett's case. Eye movement abnormalities from cortical strokes tend to involve gaze preference (i.e., both eyes deviate towards the side of the lesion) rather than a discrete deficit in a single cranial nerve.

Other symptoms such as aphasia may be present as well in a cortical lesion`
    },
    {
      id: "q4",
      number: 4,
      text: "Describe the distribution AND pattern of sensory impairment that you would be likely to find on conducting a full neurological examination",
      answer: `Dorsal column medial lemniscus pathway: Contralateral Touch, Vibration, Proprioception
Loss of touch, vibration, and proprioception on the left side of the body (below the head), since the DCML fibres cross at the level of the medulla and the lesion is above this crossing point (in the right pons).

Spinothalamic pathway: Contralateral Pain and Temp
Loss of pain and temperature sensation on the left side of the body (below the head). This occurs because the spinothalamic tract crosses over almost immediately after entering the spinal cord, so the fibres from the left side of the body ascend on the right side of the brainstem.

VTTT: Contralateral sensory information from the trigeminal nerve (CN V)
Loss of pain, temperature, and crude touch sensation on the left side of the face. This occurs because sensory fibres from the trigeminal nerve decussate (cross over) at the level of the pons and medulla to join the VTTT on the opposite side.`
    },
    {
      id: "q5",
      number: 5,
      text: "What TWO (2) other MOTOR signs affecting the head and neck might Mr Garrett exhibit",
      answer: `Dysarthria: Due to involvement of the corticobulbar tract in the pons, affecting speech muscles innervated by cranial nerves IX, X, and XII.

Dysphagia: Due to disruption of motor control pathways for cranial nerves IX (glossopharyngeal) and X (vagus), which innervate muscles responsible for swallowing.

Alternate answer:
Contralateral tongue deviation: lesion to corticobulbar tract, causing UMN lesion to hypoglossal nucleus.
Contralateral weakness of trapezius (assessed with weakness on shoulder depression): caused by lesion to corticobulbar tract, which has fibres to spinal root of accessory nerve`
    },
    {
      id: "q7",
      number: 7,
      text: "Given Mr Garrett's current presentation, what pathophysiological components of his presentation require immediate pharmacological intervention?",
      answer: `Atrial Fibrillation (AF) - Risk of thromboembolism
Atrial fibrillation leads to blood stasis in the atria, particularly the left atrium, increasing the risk of thrombus formation. This thrombus can embolize, leading to ischaemic stroke or TIA.

Anticoagulation therapy is urgently required to reduce the risk of stroke. While Mr. Garrett is currently on low-dose aspirin, this is insufficient for stroke prevention in the context of AF. He should be started on a direct oral anticoagulant (DOAC) (e.g., apixaban, rivaroxaban, dabigatran) or warfarin, depending on his renal function, bleeding risk, and preferences. These drugs are more effective than aspirin in preventing thromboembolic events in AF.

His CHA₂DS₂-VASc score of 5 indicates a high risk for stroke, and anticoagulation is critical for preventing thromboembolism.

Other
Continued/dual antiplatelet therapy (e.g., aspirin and clopidogrel) in the short term to reduce the risk of recurrent TIA or stroke.
Optimisation of antihypertensive therapy to control blood pressure and reduce stroke risk.
Continuation of statin therapy to manage hyperlipidaemia and reduce atherosclerotic burden.`
    },
    {
      id: "q8",
      number: 8,
      text: "List the drug treatment (name the drug/s and class) that need to be initiated and method of delivery.",
      answer: `Dabigatran (DOAC): 150 mg orally twice daily (may be reduced to 110 mg based on renal function)
Warfarin (VKA): Initial dose 5 mg orally daily, adjusted based on INR (if DOACs are contraindicated)
Clopidogrel (P2Y12 inhibitor): 75 mg orally once daily
Aspirin (already on low-dose, may need adjustment)
Enalapril (ACEi), atorvastatin (Statin): Both orally`
    },
    {
      id: "q9",
      number: 9,
      text: "Detail the ongoing care, from a pharmacological perspective, that may be needed to ensure that this patient is safely managed both in hospital and on discharge.",
      answer: `Ongoing pharmacological care for Mr. Garrett, both during hospitalisation and after discharge, will focus on preventing future cerebrovascular events (especially stroke), managing atrial fibrillation, controlling his cardiovascular risk factors, and ensuring appropriate follow-up and monitoring.

Anticoagulation for Atrial Fibrillation and Stroke Prevention
Antiplatelet Therapy
Hypertension Management`
    },
    {
      id: "q11",
      number: 11,
      text: "You have identified cigarette smoking as an important risk factor for Mr Garrett's clinical presentation. Briefly describe ONE (1) high risk (individual level) strategy you would recommend to reduce the harm from cigarette smoking for Mr Garrett.",
      answer: `Nicotine Replacement Therapy (NRT) combined with counselling support.

NRT (e.g., nicotine patches, gum, lozenges) helps reduce withdrawal symptoms and cravings by providing a controlled dose of nicotine without the harmful chemicals found in cigarettes.

Counselling (behavioural support) complements NRT by addressing the psychological aspects of smoking addiction, offering coping mechanisms, and encouraging long-term cessation.`
    },
    {
      id: "q12",
      number: 12,
      text: "Briefly describe ONE (1) population level strategy that has been introduced in Aotearoa New Zealand to reduce the harm from cigarette smoking.",
      answer: `Smokefree legislation combined with constant tobacco taxation and price increases on cigarettes

Increasing the cost of tobacco products through taxation has been effective in reducing smoking rates, particularly among low-income groups and youth. This strategy discourages smoking by making it less affordable, contributing to the government's goal of a Smokefree 2025, which aims to reduce smoking prevalence to less than 5%.`
    },
    {
      id: "q13",
      number: 13,
      text: "Socioeconomic position may be influencing Mr. Garrett's health. List THREE (3) questions that you might ask Mr Garrett to determine if socioeconomic position is a factor in his health. AND provide a rationale for EACH question.",
      answer: `"Do you find it difficult to afford your medications or healthcare services?"
Financial strain can affect access to essential medications and healthcare, leading to poorer health outcomes, especially for chronic conditions like hypertension and atrial fibrillation.

"What is your current housing situation, and are there any challenges related to it?"
Poor housing conditions or housing instability are linked to worse health outcomes due to stress, lack of stability, and exposure to environmental hazards (e.g., damp or cold environments), which can exacerbate chronic conditions.

"How easy is it for you to access healthy food options, such as fruits, vegetables, and whole grains?"
Access to healthy food is crucial for managing chronic conditions like hypertension and supporting overall health. Limited access to nutritious food can lead to poor dietary choices, increased consumption of processed foods high in salt, sugar, and unhealthy fats, which can exacerbate health issues.`
    },
    {
      id: "q15",
      number: 15,
      text: "You are the house surgeon on the ward when Mr Garrett is readmitted. He recognises you and confides in you saying: \"If things don't get better, I will consider ending my life\". Name a reason someone might engage in self-harm.",
      answer: `Feelings of hopelessness and despair
Significant health challenges
Health might not improve back to their normal baseline
Lack of control over their life
Self harm is a way to take back control and escape the pain`
    },
    {
      id: "q16",
      number: 16,
      text: "List four risk factors for suicidal behaviour.",
      answer: `Substance abuse
Social isolation
Personal history of mental health disorders
Family history of mental health issues`
    },
    {
      id: "q17",
      number: 17,
      text: "Identify two protective factors that may have an impact on Mr Garrett's risk of suicide.",
      answer: `Support system
Having a supportive network of family, friends, or community can provide emotional support, encouragement, and practical help. Mr. Garrett's wife, in particular, can play a crucial role in offering companionship, understanding, and assistance in managing his health, which may help reduce feelings of isolation and hopelessness.

Access to health care
Effective mental health support, including counselling or therapy, can help Mr. Garrett develop coping strategies, address his feelings of despair, and improve his overall mental well-being. Engaging with healthcare professionals who can monitor his mental health and provide interventions as needed can significantly reduce his risk of suicidal behaviour.`
    },
    {
      id: "q18",
      number: 18,
      text: "List the four categories in the ecological model of risk and protective factors.",
      answer: `Individual Factors
Family factors
Community
Societal`
    },
    {
      id: "q19",
      number: 19,
      text: "Identify TWO (2) ethical and TWO (2) legal considerations that should guide the general practitioner's response to Mr Garrett's inquiry. Briefly discuss how EACH consideration might apply to his situation.",
      answer: `Autonomy
He has a right to make informed decisions about his own life and body
If he fully understands the implications of is request
His current mental state might be affecting his decision making process

Beneficence and Non-Maleficence
Would ending his life truly be in his best interest or if it would cause harm by depriving him of potential future improvements in quality of life through rehabilitation and support.

Legal legislation on assisted dying
End of life act 2019
Terminally ill or having a grievous and irremediable condition
Capable of making an informed decision.

Informed consent and capacity
Mental capacity to make an informed decision regarding assisted dying`
    }
  ]
};
