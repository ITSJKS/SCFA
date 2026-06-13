def isPresent(n, nums, target):
    # arr=[]
    # def bin(nums,strt,end,mid):
    #     mid=(strt+end)//2
    #     if strt>=end:
    #         return 
    #     if nums[mid]==target:
    #         arr.append(mid)
    #         return 
    #     elif nums[mid]>target:
    #         bin(nums,mid+1,end,mid)
    #     else:
    #         bin(nums,strt,mid,mid)
    # if n==1:
    #     if nums[0]==target:
    #         return 0
    #     else:
    #         return -1
    # else:
    #     bin(nums,0,n-1,target)
    #     if len(arr)==0:
    #         return -1
    #     else:
    #         return arr[0]


    strt=0
    end=n
    # mid=(strt+end)//2
    while strt<end:
        
        mid=(strt+end)//2
        if nums[mid]==target:
            return mid
        if nums[mid]>target:
            strt=mid+1
        if nums[mid]<target:
            end=mid
    return -1