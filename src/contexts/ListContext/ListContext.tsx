import {
    Children,
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import  { list } from '../../pages/Board/Board.types'
import { card } from '../../components/List/List.types'
import { StateType, ContextType } from './types'
import { author, checklist, checklistItem, comment, label } from '../../components/Card/CardInfo/CardInfo.types'

export const initialState: StateType = {
  lists: []
}

export const ListContext = createContext<ContextType>({
    dispatches: {},
    state: initialState,
  })

  export const ListProvider: FC<PropsWithChildren> = ({children}) => {
    const [state, setState] = useState<StateType>(initialState)
    const dispatches: ContextType['dispatches'] = {}
   
    dispatches.setList = (listArray: list[]) => {
        setState((prev) => ({
        ...prev,
        lists: listArray,
        }))
    }

    dispatches.addList = (list: list) => {
      list.cards = [];
      const tempList = [...state.lists];
     
      tempList.push(list)
      dispatches.setList(tempList)
    }

    dispatches.updateList = (title: string, id: number) => {
      
      const tempList = [...state.lists];
      
      const listIndex = tempList.findIndex((elm)=>elm.id=== id)
      tempList[listIndex].title = title

      dispatches.setList(tempList)
    }

    dispatches.removeList = (listId: number) => {
   
      const tempList = [...state.lists];
      const newTemplist = tempList.filter((elm)=>elm.id !== listId)
      dispatches.setList(newTemplist)


    }

    dispatches.addCard = (card: card) => {
        const listIndex = state.lists.findIndex((item: list) => item.id === card?.listId);
        if (listIndex < 0) return;

        const tempList = [...state.lists];
        card.labels=[]
        card.checklists=[]
        card.comments= []
        tempList[listIndex].cards?.push(card)
        setState((prev) => ({
            ...prev,
            lists: tempList,
            }))
    }

    
    dispatches.updateCard = (card: card) => {
      const listIndex = state.lists.findIndex((item: list) => item.id === card?.listId);
      if (listIndex < 0) return;

      const tempList = [...state.lists];
      let cardIndex = tempList[listIndex].cards?.findIndex(c=>c.id === card?.id);
      if(cardIndex! < 0 || cardIndex=== undefined) return;

      tempList[listIndex].cards![cardIndex] = card;
      setState((prev) => ({
          ...prev,
          lists: tempList,
          }))
      }
      
      dispatches.insertLabel = (label: label, listId: number) => {

        const listIndex = state.lists.findIndex((item: list) => item.id === listId);
        if (listIndex < 0) return;
  
        const tempList = [...state.lists];
        const cardIndex = tempList[listIndex].cards?.findIndex(c=>c.id === label?.CardLabel.cardId);
        if(cardIndex! < 0 || cardIndex=== undefined) return;
        
        tempList[listIndex].cards![cardIndex].labels.push(label);
        setState((prev) => ({
            ...prev,
            lists: tempList,
        }))
       
      }

      dispatches.addChecklist = (checklist: checklist, listId: number) => {
        const listIndex = state.lists.findIndex((item: list) => item.id === listId);
        if (listIndex < 0) return;
        const tempList = [...state.lists];
        const cardIndex = tempList[listIndex].cards?.findIndex(c=>c.id === checklist.cardId);
        if(cardIndex! < 0 || cardIndex=== undefined) return;
        checklist.items = []
        tempList[listIndex].cards![cardIndex].checklists.push(checklist);
        setState((prev) => ({
            ...prev,
            lists: tempList,
        }))
      }


      dispatches.addChecklistItem = (checklistItem: checklistItem , listId: number, cardId: number) => {
  
        const listIndex = state.lists.findIndex((item: list) => item.id === listId);
        if (listIndex < 0) return;
        const tempList = [...state.lists];
        const cardIndex = tempList[listIndex].cards?.findIndex(c=>c.id === cardId);
        if(cardIndex! < 0 || cardIndex=== undefined) return;
        const checklistIndex = tempList[listIndex].cards![cardIndex].checklists.findIndex(elm=>elm.id === checklistItem.checklistId)

        tempList[listIndex].cards![cardIndex].checklists[checklistIndex].items.push(checklistItem)
        setState((prev) => ({
          ...prev,
          lists: tempList,
        }))
   
      }

      dispatches.addComment = (comment: comment , author: author, listId: number, cardId: number) => {
        const listIndex = state.lists.findIndex((item: list) => item.id === listId);
        if (listIndex < 0) return;
        const tempList = [...state.lists];
        const cardIndex = tempList[listIndex].cards?.findIndex(c=>c.id === cardId);
        if(cardIndex! < 0 || cardIndex=== undefined) return;
        
        comment.author = author
        tempList[listIndex].cards![cardIndex].comments.push(comment)
        setState((prev) => ({
          ...prev,
          lists: tempList,
        }))
      }

      dispatches.updateTask = (checklistItem: checklistItem , listId: number, cardId: number) => {
        const listIndex = state.lists.findIndex((item: list) => item.id === listId);
        if (listIndex < 0) return;

        const tempList = [...state.lists];

        const cardIndex = tempList[listIndex].cards?.findIndex(c=>c.id === cardId);
        if(cardIndex! < 0 || cardIndex=== undefined) return;

        const checklistIndex = tempList[listIndex].cards![cardIndex].checklists.findIndex(elm=>elm.id === checklistItem.checklistId)

        const checklistItemIndex = tempList[listIndex].cards![cardIndex].checklists[checklistIndex].items.findIndex(elm=>elm.id === checklistItem.id)

        tempList[listIndex].cards![cardIndex].checklists[checklistIndex].items[checklistItemIndex] = checklistItem
        setState((prev) => ({
          ...prev,
          lists: tempList,
        }))
      }

      dispatches.deleteLabel = (labelId: number, cardId: number, listId: number) => {
        const listIndex = state.lists.findIndex((item: list) => item.id === listId);
        if (listIndex < 0) return;

        const tempList = [...state.lists];
        const cardIndex = tempList[listIndex].cards?.findIndex(c=>c.id === cardId);
        if(cardIndex! < 0 || cardIndex=== undefined) return;

        const newLabels = tempList[listIndex].cards![cardIndex].labels.filter(l=>l.id !== labelId)
        tempList[listIndex].cards![cardIndex].labels = newLabels

        setState((prev) => ({
          ...prev,
          lists: tempList,
        }))
      
      }

      dispatches.deleteComment = (id: number, cardId: number, listId: number) => {
        const listIndex = state.lists.findIndex((item: list) => item.id === listId);
        if (listIndex < 0) return;

        const tempList = [...state.lists];
        const cardIndex = tempList[listIndex].cards?.findIndex(c=>c.id === cardId);
        if(cardIndex! < 0 || cardIndex=== undefined) return;

        const newComments = tempList[listIndex].cards![cardIndex].comments.filter(c=>c.id !== id)
        tempList[listIndex].cards![cardIndex].comments = newComments

        setState((prev) => ({
          ...prev,
          lists: tempList,
        }))
      }

      dispatches.updateDragDropList = (sourceIndex: number, destinationIndex: number) => {

        const tempList = [...state.lists];
        const sourceListOrder= tempList[sourceIndex].order

        const destinationListOrder= tempList[destinationIndex].order

        tempList[sourceIndex].order=destinationListOrder
        tempList[destinationIndex].order= sourceListOrder

        setState((prev) => ({
          ...prev,
          lists: tempList,
        }))


      }
   
  
    return (
      <ListContext.Provider
        value={{
          state,
          dispatches,
        }}
      >
        {children}
      </ListContext.Provider>
    )
  }
  
  export const useListContext = ()=>{
      return useContext(ListContext)
  }
  