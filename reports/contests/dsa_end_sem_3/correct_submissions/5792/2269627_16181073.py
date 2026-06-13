def nextGreatestLetter(letters, target):
    # for i in letters:
    #     if i>target:
    #         return i
    # return letters[0]
    s=0
    e=len(letters)-1
    ans=""

    while s<=e:
        mid=(s+e)//2

        if letters[mid]>target:
            ans=letters[mid]
            e=mid-1
        else:
            s=mid+1
    if ans:
        return ans
    else:
        return letters[0]