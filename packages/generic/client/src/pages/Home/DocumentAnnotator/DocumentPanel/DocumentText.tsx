import React, { ReactElement, useState, MouseEvent } from 'react';
import { positionType } from 'pelta-design-system';
import { AnnotationCreationTooltipMenu } from './AnnotationCreationTooltipMenu';
import { computeMultilineSelection, textNeighboursType } from '../lib';

export { PureDocumentText as DocumentText };

export type { textSelectionType };

type textSelectionType = Array<{
  index: number;
  text: string;
}>;

type propsType = { neighbours: textNeighboursType };

class PureDocumentText extends React.Component<propsType> {
  shouldComponentUpdate(nextProps: propsType) {
    return (
      nextProps.neighbours.current.index !== this.props.neighbours.current.index ||
      nextProps.neighbours.current.text !== this.props.neighbours.current.text
    );
  }

  render() {
    return <DocumentText neighbours={this.props.neighbours} />;
  }
}

function DocumentText(props: propsType): ReactElement {
  const [textSelection, setTextSelection] = useState<textSelectionType>([]);
  const [tooltipMenuOriginPosition, setTooltipMenuOriginPosition] = useState<positionType | undefined>();

  const styles = buildStyles();
  return (
    <span>
      <span onMouseUp={handleSelection} style={styles.text}>
        {props.neighbours.current.text}
      </span>
      {tooltipMenuOriginPosition && textSelection.length > 0 && (
        <AnnotationCreationTooltipMenu
          onClose={closeTooltipMenu}
          originPosition={tooltipMenuOriginPosition}
          textSelection={textSelection}
        />
      )}
    </span>
  );

  function handleSelection(event: MouseEvent<Element>) {
    const validSelection = getValidSelection(window.getSelection());
    if (!validSelection.length) {
      return;
    }

    setTextSelection(validSelection);
    openTooltipMenu(event);
  }

  function getValidSelection(selection: Selection | null) {
    console.log(selection?.toString())
    if (!selection) {
      return [];
    }
    const anchorNodeValue = selection.anchorNode?.nodeValue;
    const focusNodeValue = selection.focusNode?.nodeValue;
    const selectionText = selection.toString();

    // console.log(`anchorNodeValue : ${anchorNodeValue}`)
    // console.log(`focusNodeValue : ${focusNodeValue}`)
    // console.log(`selectionText : ${selectionText}`)
    // console.log(`!selectionText.trim() : ${!selectionText.trim()}`)
    // console.log(`selection.anchorOffset === selection.focusOffset : ${selection.anchorOffset === selection.focusOffset}`)
    if (
      !anchorNodeValue ||
      !focusNodeValue ||
      !selectionText ||
      !selectionText.trim() ||
      selection.anchorOffset === selection.focusOffset
    ) {
      console.log([])
      return [];
    }
    if (anchorNodeValue === focusNodeValue) { //cette condition entraine un bug si on cherche a créer une annotation sur plusieurs lignes qui commence et qui termine par le même mot, en effet la condition sera vraie alors qu'il sagirat d'un anchor et d'un focus différent
      console.log("anchorNodeValue === focusNodeValue")
      console.log([{ text: selectionText.trim(), index: computeSelectedTextIndex(selection) }])
      return [{ text: selectionText.trim(), index: computeSelectedTextIndex(selection) }];
    } else {
      /*---------------
      Cas ou plusieurs lignes ont été selectionnées
      Proposition : le paragraphe selectionné doit prendre tous les mots des paragraphes du début et de la fin
      même si tous les mots n'ont pas été selectionés --> si on selectionne par paragraphes on prend tout le paragraphe, pas qu'une partie
      
      NB: cette sélection est soit bornée par un retour a la ligne (paragraphe) soit par une autre annotation (pour pas qu'il n'y ai pas d'overlap)
      Donc on peut un peu bypass la sélection globale d'un paragraphe en plaçant une annotation avant dans le paragraphe pour "limiter" son annotation de paragraphe 

      Techniquement : 
      1/ on utilise les neighbours : dans le cas d'une sélection de paragraphe on a :
      Le début du premier paragraphe sélectionné dans before, a l'indice length-nombre de numéros de ligne retirés (ça marche quand il y a plusieurs paragraphes sélectionnés ça ?)
      --> on trouve l'indice de départ de l'annotation et le texte par lequel l'annotation commence
      la fin du dernier paragraphe : on a le texte de la fin de la sélection dans current
      Attention, il faut inverser en fonction du sens de sélection du texte, de haut en bas ou de bas en haut

      2/ On utilise le current pour avoir le texte du début ou de la fin (en fonction du sens de sélection)
      puis on cherche le texte dans les neighbours pour avoir l'autre extrémité du texte.

      Warning : (ces warning ne concernent pas forcément toutes les possibilités techniques)
      - si on sélectionne de bas en haut il va se passer quoi ?
      - si il y a 2 lignes dans le texte qui sont rigouresement identiques il se passe quoi ?
      - si un numéro de ligne est dans le texte alors ça peut identifer le numéro de ligne comme index de l'annotation
      ---------------*/

    console.log("------------------------")
    // console.log(`selectionText.trim() : ${JSON.stringify(selectionText)}`)
    console.log(`anchorNodeValue : ${anchorNodeValue}`)
    console.log(`focusNodeValue : ${focusNodeValue}`)
    console.log(JSON.stringify(`props.neighbours.before : ${JSON.stringify(props.neighbours.before)}`))
    console.log(JSON.stringify(`props.neighbours.after : ${JSON.stringify(props.neighbours.after)}`))
    console.log(JSON.stringify(`props.neighbours.current : ${JSON.stringify(props.neighbours.current)}`))
    const multilineSelection = computeMultilineSelection(
      selectionText.trim(),
      props.neighbours,
      anchorNodeValue,
      focusNodeValue,
    );
    console.log(`multilineSelection : ${JSON.stringify(multilineSelection)}`)
    return multilineSelection;

      //Version un peu cheap qui marche presque 
      // console.log(JSON.stringify(selectionText))
      // const cleanedText = selectionText.replace(/\n\d+\n/g, '\n')
      // console.log(JSON.stringify(cleanedText))

      // console.log(JSON.stringify(`props.neighbours.before : ${JSON.stringify(props.neighbours.before)}`))
      // console.log(JSON.stringify(`props.neighbours.after : ${JSON.stringify(props.neighbours.after)}`))
      // console.log(JSON.stringify(`props.neighbours.current : ${JSON.stringify(props.neighbours.current)}`))
      
      // return [{ text: cleanedText, index: selection.anchorOffset + props.neighbours.current.index }];
    }

    // console.log("------------------------")
    // console.log(`selectionText.trim() : ${selectionText.trim()}`)
    // console.log(`props.neighbours : after : ${props.neighbours.after.toString()}, before : ${props.neighbours.before.toString()},curent.index : ${props.neighbours.current.index}, curent.text : ${props.neighbours.current.text}`)
    // console.log(`anchorNodeValue : ${anchorNodeValue}`)
    // console.log(`focusNodeValue : ${focusNodeValue}`)
    // const multilineSelection = computeMultilineSelection(
    //   selectionText.trim(),
    //   props.neighbours,
    //   anchorNodeValue,
    //   focusNodeValue,
    // );
    // console.log(`multilineSelection : ${multilineSelection}`)
    // return multilineSelection;
  }

  function openTooltipMenu(event: MouseEvent<Element>) {
    setTooltipMenuOriginPosition({ x: event.clientX, y: event.clientY });
  }

  function closeTooltipMenu() {
    setTooltipMenuOriginPosition(undefined);
  }

  function computeSelectedTextIndex(selection: Selection) {
    console.log(`selection.anchorOffset : ${selection.anchorOffset}`)
    console.log(`selection.focusOffset : ${selection.focusOffset}`)
    console.log(`props.neighbours.current.index : ${props.neighbours.current.index}`)
    return Math.min(selection.anchorOffset, selection.focusOffset) + props.neighbours.current.index;
  }
}

function buildStyles() {
  return {
    text: {
      whiteSpace: 'break-spaces',
    },
  } as const;
}
