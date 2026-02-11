"use client";

import { FC, useState, ReactNode } from "react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LucideIndianRupee , LucideChevronDown, LucideChevronRight, HandPlatter } from "lucide-react";
import { Button } from "../button";
import { ButtonGroup } from "../button-group";
import { Label } from "../label";
import _ from "lodash";


interface MenuItemCardProps {
  id:string;
  index: number;
  key?: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string | null;
  maxAllowedQuantity?: number;
  errors?:object ;
  quantity?: number;
  onAdd?: () => void;
  onRemove?: () => void;
}

const MenuItemCard: FC<MenuItemCardProps> = ({
  index,
  key,
  id,
  name,
  price,
  description,
  imageUrl,
  quantity,
  maxAllowedQuantity,
  errors,
  onAdd,
  onRemove,
}) => {
  const [open, setOpen] = useState(false);
 

  return (
    <div className="flex w-full  flex-col" key={id}>
        <Item variant={index % 2 === 0 ? "outlined":"muted"} className="gap-x-3">
           {  <ItemMedia variant="icon">
                    
              {!_.isEmpty(imageUrl) ? (
                <Avatar className="w-8 h-8">
                  <AvatarImage src={imageUrl} alt={name} />
                 </Avatar>
              ) : (
               
                  <HandPlatter className="w-4 h-4 text-gray-500" />
               
              )}
           
        </ItemMedia>}
         <ItemContent >
          <ItemTitle className="font-bold">
              {name}
          </ItemTitle>
          <ItemDescription className="flex ">
             
               <LucideIndianRupee className="w-3.5 h-3.5"/>
                <Label className="text-black">{price}</Label>
           
          </ItemDescription>
          {description &&<ItemDescription className="mt-2 ">
             <div
            className="flex items-center gap-x-1 cursor-pointer text-xs text-gray-500 select-none"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <LucideChevronDown className="w-3 h-3" />
            ) : (
              <LucideChevronRight className="w-3 h-3" />
            )}
            <span>{open ? "Hide details" : "Show details"}</span>
          </div>
           {open && <ItemDescription className="mt-2 text-blue-500">{description}</ItemDescription>}
          </ItemDescription>}
          </ItemContent>
          <ItemActions>
            <div className=" flex items-center justify-center flex-col  gap-y-1">
              <div className="self-end flex-none">
           { quantity === 0 ?<Button
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => onAdd()}
                      >
                        +Add
                      </Button>
                     :
                      <ButtonGroup>
                        <Button
                         className="bg-green-500 hover:bg-green-600 text-white"
                          variant="outline"
                          onClick={() => onRemove()}
                        >
                          -
                        </Button>
                        <Button  disabled className="cursor-default bg-white text-black !font-bold">
                          {quantity}
                        </Button>
                        <Button
                    
                         className="bg-green-500 hover:bg-green-600 text-white"
                          variant="outline"
                          onClick={() => onAdd()}
                        >
                          +
                        </Button>
                      </ButtonGroup>
                     } </div>
                      {(quantity > maxAllowedQuantity || errors?.maxQualityAllowed )&& (
                      <p className="text-sm text-red-500">
                        {errors?.maxQualityAllowed ?? `exceeds max allowed (${maxAllowedQuantity})` }
                      </p>
                    )}
                    </div>
        </ItemActions>
        </Item>
    </div>
  );
};

export default MenuItemCard;
