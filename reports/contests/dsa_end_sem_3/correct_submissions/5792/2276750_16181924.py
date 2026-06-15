def nextGreatestLetter(letters, target):
    # for i in letters:
    #     if i>target:
    #         return(i)
    #         break
    # a=letters[0]
    # for i in letters:
    #     if a[-1]!=i:
    #         a=a+i
    # # print(a)
    # letters=a
    # # print(letters)



    if target<letters[0] or target>=letters[-1]:
        return letters[0]
    
    else:
        strt=0
        end=len(letters)
        while strt<end:
            mid=(strt+end)//2
            if letters[mid]==target and letters[mid+1]!=target  :
                return letters[mid+1]
            if letters[mid]>target and letters[mid-1]<target:
                return letters[mid]
            # if letters[mid]<target and letters[mid+1]>target:
            #     return letters[mid+1]
            elif letters[mid]>target:
                end=mid
            elif letters[mid]<=target:
                strt=mid+1