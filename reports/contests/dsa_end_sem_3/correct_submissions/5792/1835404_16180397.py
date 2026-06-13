def nextGreatestLetter(letters, target):
    n= len(letters)
    start=0
    end=len(letters)-1
    ans=letters[0]
    while start<=end:
        mid=(start+end)//2
        if letters[mid]>target:
            ans=letters[mid]
            end=mid-1
        elif letters[mid]<target:
            start=mid+1
        else:
            start=mid+1
    
    return ans
        
    # for i in letters:
    #     if char(i)>=char(target):
    #         return char