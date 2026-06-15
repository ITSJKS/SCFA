def firstOccurrence(nums):
    
    k=1
    l=0
    ans=-1
    r=len(nums)-1
    while l<=r:
        mid=(l+r)//2
        
        if arr[mid]==k:
            ans=mid
            r=mid-1
        elif  arr[mid]>k:
            l=mid+1
        
    return ans