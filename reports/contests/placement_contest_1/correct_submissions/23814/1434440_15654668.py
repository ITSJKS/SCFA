def firstOccurrence(nums):
    l=0
    r=len(nums)-1
    ans=-1
    while l<=r:
        mid=(l+r)//2
        if nums[mid]==1:
            ans=mid
            r=mid-1
        elif nums[mid]>1:
            l=mid+1

    return ans