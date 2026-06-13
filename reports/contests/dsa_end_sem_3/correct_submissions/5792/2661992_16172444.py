def nextGreatestLetter(letters, target):
    left=0
    right=len(letters)
    ans=''
    while left<right:
        mid=(left+right)//2
        if letters[mid]>target:
            ans=letters[mid]
            right=mid-1
        else:
            left=mid+1
    if letters[0]>target and letters[0]<=ans:
        return letters[0]
    if ans>target:
        return ans
    return letters[0]